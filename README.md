# creed
# para permitir peticiones al backend sin problema de cors se debe crear el archivo proxy.conf.json 
# de igual forma se debe poner en el angular json 

  "serve": {
    "options": {
      "proxyConfig": "proxy.conf.json"
    }
  }

# .ignore me quita las librerias de node modules 


Link para spring boot:
https://start.spring.io/

Ingresar a una terminal de comandos:

Ejecutar ls para revisar el árbol de carpetas y archivos

ls


Ingresamos a la carpeta del backend:


cd .\BACK_SGME\

Instalamos los paquetes necesarios:


npm i

npm install axios

Iniciamos el backend:


npm start

—-------------------------------------------------------

Ahora el front end:


cd .\PROYECT_SGME

npm install

ng serve --port 4300 (se recomienda ejecutar el frontend en este puerto)

Ahora iniciamos el proyecto:
En caso de estar usando el mismo servidor se pide cambiar el puerto.
ng serve -o
? Port 4200 is already in use.
Would you like to use a different port? Yes
Initial chunk files | Names     	|  Raw size
styles.css      	| styles    	| 271.13 kB |
scripts.js      	| scripts   	| 230.93 kB |
main.js         	| main      	| 193.49 kB |
polyfills.js    	| polyfills 	|  86.30 kB |

                	| Initial total | 781.84 kB

Application bundle generation complete. [6.614 seconds]

Watch mode enabled. Watching for file changes...
  ➜  Local:   http://localhost:57318/
  ➜  press h + enter to show help

—--------------------------

Aqui ya podría modificarse el trabajo:


(EN EL FRONTEND)
cd .\PROYECT_SGME\
ng g c internal_pages/reportes

//para crear el apartado de reportes

https://start.spring.io/


API de google calendar:
npm install gapi-script
npm install igniteui-angular --force or --legacy-peer-deps	


tras crear la carpeta poner la carpeta dentro del proyecto
luego ejecutar los siguientes comandos:


cd .\reports-sgme\  //cambia según el nombre que se le haya puesto a la carpeta
revisar el archivo pom.xml y application.properties
en pom.xml revisar todas las dependencias necesarias para spring boot y revisar  el application.properties si tiene las credenciales correctas para la conexión con la base de datos con la que se trabajara.

./mvnw spring-boot:run

para ejecutar una limpieza del proyecto en caso de que no funcione correctamente:

./mvnw clean install  

para ejecutar spring boot con los logs:
./mvnw spring-boot:run -X
para ejecutar la carpeta “test” en vez de la “main”:


./mvnw test
tras esto, el proyecto estaría funcional cada carpeta trabaja en su propio puerto:
Frontend(Typescript - Angular): http://localhost:4300
Backend (Node.js - Express): http://localhost:5000
Backend (Java - Spring boot): http://localhost:8080

PS C:\Users\Sistemas\creed> ls


	Directorio: C:\Users\Sistemas\creed

----             	-------------     	------ ----                                                  	 
d-----   	3/09/2024  9:02 a. m.            	BACK_SGME                                             	 
d-----   	3/09/2024  9:11 a. m.            	PROYECT_SGME
-a----   	3/09/2024  9:17 a. m.        	548 README.md


PS C:\Users\Sistemas\creed> cd .\PROYECT_SGME\

PS C:\Users\Sistemas\creed> cd .\PROYECT_SGME\
PS C:\Users\Sistemas\creed> cd .\PROYECT_SGME\
PS C:\Users\Sistemas\creed\PROYECT_SGME> ng g c internal_pages/reportes
CREATE src/app/internal_pages/reportes/reportes.component.html (24 bytes)
CREATE src/app/internal_pages/reportes/reportes.component.spec.ts (633 bytes)
CREATE src/app/internal_pages/reportes/reportes.component.ts (254 bytes)
CREATE src/app/internal_pages/reportes/reportes.component.css (0 bytes)
PS C:\Users\Sistemas\creed\PROYECT_SGME>

—-------------------------------------------------------------------


PS C:\Users\Sistemas\creed> ls




Mode             	LastWriteTime     	Length Name
----             	-------------     	------ ----
d-----   	3/09/2024  8:57 a. m.            	BACK_SGME
d-----   	3/09/2024  8:57 a. m.            	PROYECT_SGME
-a----   	3/09/2024  8:57 a. m.         	20 README.md

chrome.exe --disable-web-security --user-data-dir="C:/ChromeDev"





  SELECT * FROM programas where activado = 'S'
	SELECT * FROM docentes
	select * from facultades
	//programas
	
SELECT *
      FROM programas AS po
      INNER JOIN facultades AS fac ON po.id_facultad = fac.id
      WHERE po.activado = 'S' 
      AND po.clase_programa NOT IN ('MV');
	
	SELECT po.id, po.nombre
      FROM programas AS po
      INNER JOIN facultades AS fac ON po.id_facultad = fac.id
      WHERE po.activado = 'S' 
      AND po.clase_programa NOT IN ('MV');
			
	//docentes
	SELECT
	per.primer_nombre,
	per.segundo_nombre,
	per.primer_apellido,
	per.segundo_apellido,
	doc.*
FROM
	docentes doc
INNER JOIN
	personas per ON doc.id_persona = per.id
	INNER JOIN
	asignacion_academica asigc ON asigc.id_docente = doc.id
	INNER JOIN
	programas prog ON doc.id_programa = prog.id
	INNER JOIN
	facultades facu ON facu.id = prog.id_facultad
    	where doc.estado=true 
			and asigc.id_periodo_academico = (SELECT id from periodos_academicos where estado = 2) 
			 AND prog.activado = 'S'
      AND prog.clase_programa NOT IN ('MV');
			AND prog.id_facultad = 4 ;  
		
	

SELECT * from asignacion_academica asic
			INNER JOIN
			docentes doc ON doc.id = asic.id_docente
			INNER JOIN
			asignaturas_plan_estudios asicape ON asicape.id = asic.id_asignaturas_plan_estudios
			INNER JOIN 
			asignaturas asig ON asig.id = asicape.id_asignatura
			Where asig.id = 958 and doc.estado = true
			
			
			
			SELECT
        per.primer_nombre,
        per.segundo_nombre,
        per.primer_apellido,
        per.segundo_apellido,
        doc.*
      FROM docentes doc
      INNER JOIN personas per ON doc.id_persona = per.id
      INNER JOIN asignacion_academica asigc ON asigc.id_docente = doc.id
      INNER JOIN programas prog ON doc.id_programa = prog.id
      WHERE doc.id_programa = 1
      AND asigc.id_periodo_academico = (SELECT id FROM periodos_academicos WHERE estado = 2) 
      AND doc.estado = true
      AND prog.activado = 'S'
      AND prog.clase_programa NOT IN ('MV');

	  LINKS:
	  https://github.com/fullcalendar/fullcalendar-examples