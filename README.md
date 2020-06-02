# Mapsage

* This is a MEVN web application 
* Mapsage is a social network for masseurs and their costumers 
* Backend server based on node/express
* Frontend based on vue-cli

# Git workflow

* Create new branch
```
git checkout -b childBranch fatherBranch
```

* push > Merge and push > childBranch delete
```
git push

git checkout fatherBranch

git merge --no-ff childBranch

git branch -d childBranch
```

# Launch:

### Frontend Set Up
```
cd mapsage
cd frontend
npm install
```

### Backend Set Up
```
cd mapsage
cd backend
npm install
```

# Load Application:


### Backend server load:
```
cd mapsage
cd backend
npm run devStart
```

#

### Frontend load:

* open terminal 
* launch following command
```
vue cli
```
* in browser: task > serve > avvia il task > Apri l'app


#

# Packages

npm packages:
* mongoose
* express
* axios
* body-parser
* ejs


npm packages used for login and authorization:
* [bcrypt](https://www.npmjs.com/package/bcrypt): encrypts passwords which will be stored in database
* [hashing_function_sha512](http://pajhome.org.uk/crypt/md5/sha512.html): hashes passwords which will be sent to server for login/registration 
* [jwt-decode](https://www.npmjs.com/package/jwt-decode): decodes json web token
* [jwt](https://www.npmjs.com/package/jsonwebtoken): decodes json web token