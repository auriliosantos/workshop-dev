/* importações */
const express = require("express")
const server = express()

const db = require("./db")


/* configurações do express */
server.use(express.static("public"))
server.use(express.urlencoded({ extended: true }))


/* conficurações de template */
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true,
})


/* configurações de rotas */
server.get("/", function(req, res) {

    db.all(`SELECT * FROM ideas`, function(err,rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no Banco de Dados!")
        }

        const reversedIdeas = [...rows].reverse()

        let lastIdeas = []
        for (idea of reversedIdeas) {
            if(lastIdeas.length < 2) {
                lastIdeas.push(idea)
            }
        }


        return res.render("index.html", { ideas: lastIdeas})
        })

    
})

server.get("/ideias", function(req, res) {  

    db.all(`SELECT * FROM ideas`, function(err,rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no Banco de Dados!")
        }

        const reversedIdeas = [...rows].reverse()
    
        return res.render("ideias.html", { ideas: reversedIdeas})
    })
})

server.get("/deletarIdeia", function(req, res) {
    delId = [req.query.id]
    db.run(`DELETE FROM ideas WHERE id = ?`, delId, function(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no Banco de Dados!")
        }

        return res.redirect("/ideias")
    })
})

server.post("/", function(req, res) {
    const query = `
            INSERT INTO ideas(
                image,
                title,
                category,
                description,
                link
            ) VALUES (?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]

    db.run(query, values, function(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no Banco de Dados!")
        }

        return res.redirect("/ideias")
    })
})


/* abrir porta de conexão */
server.listen(3000)