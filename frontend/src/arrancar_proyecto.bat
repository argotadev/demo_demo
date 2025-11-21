::EJECUTAMOS EL DEMONIO DE MONGODB 
start cmd.exe /k "cd C:\Program Files\MongoDB\Server\7.0\bin && mongod.exe --dbpath c:/data/db"

::EJECUTAMOS EL BACKEND DEL PROYECTO  
start cmd.exe /k "cd C:\Users\Augusto\Desktop\agronat_vite\backend && npm start"

::EJECUTAMOS EL FRONTEND DEL PROYECTO
start cmd.exe /k "cd C:\Users\Augusto\Desktop\agronat_vite && npm run dev"

::START MONGO COMPASS 
start  "cd C:\Users\Augusto\AppData\Local\MongoDBCompass.exe"

::START POSTMAN 
start  "cd C:\Users\Augusto\AppData\Local\Postman.exe"