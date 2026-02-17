// importamos express para crear el servidor
const express = require("express");

// creamos la aplicacion principal de express
const app = express();

// importamos mysql2 para conectarnos a la base de datos mysql
const mysql = require("mysql2"); // https://github.com/mysqljs/mysql npm install mysqljs/mysql

// importamos cors para permitir peticiones desde otros dominios (ej frontend en otro puerto)
const cors = require("cors"); //https://www.npmjs.com/package/cors npm i cors

// me permite gestionar imagenes para subirlas a un servidor
const multer = require('multer')

// modulo para trabajar con rutas de archivos y carpetas
const path = require('path')


// activamos cors en toda la aplicacion
app.use(cors());

// permitimos que express pueda leer json enviados en el body
app.use(express.json());

// configuracion de la base de datos
// aqui definimos los datos necesarios para conectarnos a mysql
const db = mysql.createConnection({
  user: "gymuser",        // usuario de la base de datos
  host: "localhost",      // servidor donde esta mysql
  password: "gympass",    // contraseña del usuario
  database: "gymdb",      // nombre de la base de datos
});

// ruta get para obtener todos los clientes
// se usa normalmente para mostrar todos los clientes en una tabla del frontend
app.get("/clientes", (req, res) =>{
    // consulta sql para seleccionar todos los registros
    const consulta = "SELECT * FROM clients";

    // ejecutamos la consulta
    db.query(consulta, (error, resultado) =>{
        // si ocurre un error lo mostramos por consola y lo devolvemos
        if (error){
            console.log(error);
            return res.json(error);
        }
        // si todo va bien devolvemos el resultado en formato json
        return res.json(resultado);
    });
});

app.post("/nuevoCliente", (req, res) => {

    // extraemos los datos enviados desde el frontend
    const {
        nombre,
        apellidos,
        dni,
        fecha_nacimiento,
        telefono,
        email,
        peso,
        altura,
        objetivo,
        fecha_inicio,
        fecha_fin,
        trainer_id,
        tipo_pago
    } = req.body;

    // validacion simple: si telefono existe y no es numerico devolvemos error
    if ( telefono && isNaN(telefono) ){
        return res.status(400).send(
            {
                success: false,
                message: "El número de teléfono no es correcto."
            }
        );
    }

    // comprobamos si ya existe un cliente con ese dni
    db.query("SELECT * FROM clients WHERE dni = ?", [dni], (err, results) => {

        // si hay error en la consulta
        if (err) {
            console.log(err);
            return res.status(500).send(
                {
                    success: false,
                    message: "Error al comprobar si el cliente existe." 
                }
            );
        }

        // si ya existe un cliente con ese dni devolvemos error
        if (results.length > 0) {
            return res.status(400).send(
                {
                    success: false,
                    message: "Ya existe un cliente con ese DNI" 
                }
            );
        }

        // si trainer_id viene informado comprobamos que exista en la tabla trainers
        if (trainer_id) {
            db.query(
                "SELECT * FROM trainers WHERE id = ?",
                [trainer_id],
                (err, results) => {

                    // error al comprobar entrenador
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Error al comprobar entrenador"
                        });
                    }

                    // si no existe entrenador con ese id
                    if (results.length === 0) {
                        return res.status(400).json({
                            success: false,
                            message: `El entrenador con ID (${trainer_id}) no existe`
                        });
                    }

                    // si existe entrenador llamamos a la funcion que inserta el cliente
                    insertarCliente(); 
                }
            );
        } else {
            // si no hay trainer_id insertamos directamente
            insertarCliente();
        }

        // funcion interna para insertar el cliente en la base de datos
        function insertarCliente(){
            db.query(
                // consulta sql para insertar un nuevo cliente
                `INSERT INTO clients 
                (nombre, apellidos, fecha_nacimiento, dni, telefono, email, fecha_inicio, fecha_fin, tipo_pago, peso, altura, objetivo, trainer_id) 
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                    nombre,
                    apellidos,
                    fecha_nacimiento,
                    dni,
                    telefono || null,     // si telefono esta vacio guardamos null
                    email || null,
                    fecha_inicio,
                    fecha_fin || null,
                    tipo_pago,
                    peso || null,
                    altura || null,
                    objetivo || null,
                    trainer_id || null
                ],
                (err, result) => {

                    // si ocurre error al insertar
                    if (err) {
                        console.log(err);
                        return res.status(500).send(
                            {
                                success: false,
                                message: "Error al insertar cliente" 
                            }
                        );
                    }

                    // si todo sale bien devolvemos confirmacion
                    return res.send({
                        success: true,
                        message: "Cliente "+nombre+" añadido correctamente" 
                    });
                }
            );
        }
    });
});

// metodo para actualizar los datos de un cliente
app.post("/actualizarCliente/:id", (requerimientos, respuesta) =>{
    
    // extraemos la id del cliente que estamos editando
    const id = requerimientos.params.id;

    // extraemos los datos enviados desde el frontend
    const {
        nombre,
        apellidos,
        dni,
        fecha_nacimiento,
        telefono,
        email,
        peso,
        altura,
        objetivo,
        fecha_inicio,
        fecha_fin,
        trainer_id,
        tipo_pago,
        alta
    } = requerimientos.body;

    // si nos pasan un telefono, comprobamos que sea numerico, si no, error
    if ( telefono && isNaN(telefono) ){
        return respuesta.status(400).json(
            {
                success: false,
                message: "El número de teléfono no es correcto."
            }
        );
    }

    // comprobamos que el dni no exista en otro usuario
    // hacemos un select a un cliente con ese dni, si nos devuelve
    // un cliente (puede ser él mismo si el usuario no lo ha cambiado)
    // para ello comprobamos también que la id no sea del mismo usuario que estamos editando
    db.query(
        "SELECT id FROM clients WHERE dni = ?", [dni], (error, resultado) =>{
            if (error){
                console.log(error);
                return respuesta.status(500).json(
                    {
                        success: false,
                        message: `Error al comprobar si el cliente con dni (${dni}) existe.`
                    }
                );
            }

            // si se ha encontrado un cliente comprobamos si la id
            // es del mismo usuario que estamos editando, entonces permitimos el dni
            if (resultado.length > 0 && id != resultado[0].id){
                
                return respuesta.status(400).json(
                    {
                        success: false,
                        message: `El DNI (${dni}) ya existe en otro cliente.`
                    }
                );
            }

            // si trainer_id viene informado comprobamos que exista en la tabla trainers
            if (trainer_id) {
                db.query(
                    "SELECT * FROM trainers WHERE id = ?", [trainer_id],
                    (err, results) => {

                        // error al comprobar entrenador
                        if (err) {
                            return respuesta.status(500).json({
                                success: false,
                                message: "Error al comprobar entrenador."
                            });
                        }

                        // si no existe entrenador con ese id
                        if (results.length === 0) {
                            return respuesta.status(400).json({
                                success: false,
                                message: `El entrenador con ID (${trainer_id}) no existe`
                            });
                        }

                        // si existe entrenador llamamos a la funcion que inserta el cliente
                        actualizarCliente(); 
                    }
                );
            } else {
                // si no hay trainer_id actualizamos directamente
                actualizarCliente();
            }
            


            function actualizarCliente() {

                db.query(
                    `
                    UPDATE clients SET
                        nombre = ?,
                        apellidos = ?,
                        fecha_nacimiento = ?,
                        dni = ?,
                        fecha_inicio = ?,
                        fecha_fin = ?,
                        tipo_pago = ?,
                        alta = ?,
                        telefono = ?,
                        email = ?,
                        peso = ?,
                        altura = ?,
                        objetivo = ?,
                        trainer_id = ?
                    WHERE id = ?
                    `,
                    [
                        nombre,
                        apellidos,
                        formatearFecha(fecha_nacimiento),
                        dni,
                        formatearFecha(fecha_inicio),
                        formatearFecha(fecha_fin) || null,
                        tipo_pago,
                        alta,
                        telefono || null, 
                        email || null,
                        peso || null,
                        altura || null,
                        objetivo || null,
                        trainer_id || null,
                        id
                    ],
                    (err, result) => {
                        if (err){
                            console.log(err);
                            return respuesta.status(500).json(
                                {
                                    success: false,
                                    message: "Error al actualizar el cliente. (N:1)"
                                }
                            );
                        }

                        return respuesta.json(
                            {
                                success: true,
                                message: `Cliente con ID(${id}) actualizado correctamente.`
                            }
                        );
                    }
                );
            }
            
            function formatearFecha(fecha) {
                if (!fecha) return null;
                return new Date(fecha).toISOString().split('T')[0];
            }

        }
    );
});


// ruta get para obtener todos los entrenadores
app.get("/entrenadores", (req, res) =>{
    const consulta = "SELECT * FROM trainers";

    db.query(consulta, (error, resultado) =>{
        if (error){
            console.log(error);
            return res.json(error);
        }
        return res.json(resultado);
    });
});

app.post("/nuevoEntrenador", (req, res) => {

    // extraemos datos del body
    const {
        nombre,
        apellidos,
        fecha_nacimiento,
        dni,
        fecha_inicio,
        fecha_fin,
        tipo_pago,
        telefono,
        email,
        especialidad,
        notas
    } = req.body;

    // validacion basica del telefono
    if ( telefono && isNaN(telefono) ){
        return res.status(400).send(
            {
                success: false,
                message: "El número de teléfono no es correcto."
            }
        );
    }

    // comprobamos si ya existe un entrenador con ese dni
    db.query("SELECT * FROM trainers WHERE dni = ?", [dni], (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).send(
                {
                    success: false,
                    message: "Error al comprobar si el entrenador existe." 
                }
            );
        }

        if (results.length > 0) {
            return res.status(400).send(
                {
                    success: false,
                    message: "Ya existe un entrenador con ese mismo DNI." 
                }
            );
        }
        
        // insertamos nuevo entrenador
        db.query(
            `INSERT INTO trainers 
            (nombre, apellidos, fecha_nacimiento, dni, fecha_inicio, fecha_fin, tipo_pago, telefono, email, especialidad, notas) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
            [
                nombre,
                apellidos,
                fecha_nacimiento,
                dni,
                fecha_inicio,
                fecha_fin || null,
                tipo_pago,
                telefono || null,
                email,
                especialidad || null,
                notas || null
            ],
            (err, result) => {

                if (err) {
                    console.log(err);
                    return res.status(500).send(
                        {
                            success: false,
                            message: "Error al insertar entrenador" 
                        }
                    );
                }

                return res.send({
                    success: true,
                    message: "Entrenador "+nombre+" añadido correctamente" 
                });
            }
        );
    });
});


// ruta para login de usuario
app.post("/login", (req, res) => {

    // obtenemos usuario y contraseña del body
    const { username, password } = req.body;

    // buscamos la contraseña del usuario en la base de datos
    const consulta = "SELECT password FROM auth_users WHERE username = ?";
    db.query(consulta, [username], (error, resultado) => {

        if (error) {
            console.error(error);
            return res.status(500).json({ ok: false });
        }

        // si no existe usuario
        if (resultado.length === 0) {
            return res.json({ ok: false });
        }

        // obtenemos contraseña guardada en la base de datos
        const passwordBD = resultado[0].password;

        // comparamos contraseña enviada con la almacenada
        if (password !== passwordBD) {
            return res.json({ ok: false });
        }

        // si coinciden devolvemos ok true
        return res.json({ ok: true });
    });
});

app.delete("/eliminarCliente", (req, res) =>{

    // obtenemos id del cliente desde el body
    const {id} = req.body;

    const consulta = "DELETE FROM clients WHERE id = ?";

    // ejecutamos delete
    db.query(consulta, [id], (err, data) =>{

        if (err){
            return res.status(400).json(
                {
                    success: false,
                    message: "Error al eliminar el cliente: " + err
                }
            );
        }

        // si no se elimino ninguna fila significa que no existia ese id
        if (data.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "No existe un cliente con ese id"
            });
        }

        // si se elimino correctamente
        return res.status(200).json({
            success: true,
            message: "Cliente con id ("+id+") eliminado correctamente."
        });

    });
});

app.delete("/eliminarEntrenador", (req, res) =>{

    const {id} = req.body;

    const consulta = "DELETE FROM trainers WHERE id = ?";

    db.query(consulta, [id], (err, data) =>{

        if (err){
            return res.status(400).json(
                {
                    success: false,
                    message: "Error al eliminar el entrenador: " + err
                }
            );
        }

        if (data.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "No existe el entrenador con ese id"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Entrenador con id ("+id+") eliminado correctamente."
        });

    });
});


// ruta para obtener un cliente concreto por su id
app.get("/cliente/:id", (requerimientos, resultado) => {

    // obtenemos id desde los parametros de la url
    const id = requerimientos.params.id;

    db.query(
        "SELECT * FROM clients WHERE id = ?",
        id,
        (error, cliente) =>{
            if (error){
                return resultado.status(400).json(
                    {
                        success: false,
                        message: "Error al seleccionar el cliente."
                    }
                );
            } else {
                // devolvemos los datos del cliente encontrado
                return resultado.json(cliente);
            }
        }
    );
});

// ruta para obtener un entrenador concreto por su id
app.get("/entrenador/:id", (requerimientos, resultado) => {

    // obtenemos id desde los parametros de la url
    const id = requerimientos.params.id;

    db.query(
        "SELECT * FROM trainers WHERE id = ?",
        id,
        (error, enrtenador) =>{
            if (error){
                return resultado.status(400).json(
                    {
                        success: false,
                        message: "Error al seleccionar el entrenador."
                    }
                );
            } else {
                // devolvemos los datos del cliente encontrado
                return resultado.json(enrtenador);
            }
        }
    );
});

// configuracion de almacenamiento para multer
const storage = multer.diskStorage({

  // definimos carpeta destino segun la ruta
  destination: function (req, file, cb) {

    // si la ruta contiene clientes guardamos en carpeta clientes
    if (req.originalUrl.includes('clientes')) {
      cb(null, path.join(__dirname, 'uploads/clientes'));
    } else {
      // si no, guardamos en carpeta entrenadores
      cb(null, path.join(__dirname, 'uploads/entrenadores'));
    }
  },

  // definimos nombre unico para el archivo
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// creamos middleware de subida usando esa configuracion
const upload = multer({ storage: storage });

// permitimos acceder a la carpeta uploads desde el navegador
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ruta para subir foto de cliente
app.post('/clientes/foto', upload.single('image'), (req, res) => {

  const id = req.body.id; // ahora el id viene en el body

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No se ha enviado ninguna imagen"
    });
  }

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "No se ha enviado el id del cliente"
    });
  }

  const imagePath = '/uploads/clientes/' + req.file.filename;

  db.query(
    "UPDATE clients SET foto = ? WHERE id = ?",
    [imagePath, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al guardar la foto"
        });
      }

      return res.json({
        success: true,
        message: "Foto subida correctamente",
        path: imagePath
      });
    }
  );
});



// ruta para subir foto de entrenador
app.post('/entrenadores/foto', upload.single('image'), (req, res) => {

  const id = req.body.id;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No se ha enviado ninguna imagen"
    });
  }

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "No se ha enviado el id del entrenador"
    });
  }

  const imagePath = '/uploads/entrenadores/' + req.file.filename;

  db.query(
    "UPDATE trainers SET foto = ? WHERE id = ?",
    [imagePath, id],
    (err, result) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al guardar la foto"
        });
      }

      return res.json({
        success: true,
        message: "Foto subida correctamente",
        path: imagePath
      });
    }
  );
});



// iniciamos el servidor en el puerto 3001
app.listen(3001, () => {
    console.log("El servidor esta en escucha en el puerto 3001");
});
