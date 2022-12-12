const express = require("express")

const { todoModel } = require("../models/Todo.model")

const todoRouter = express.Router()

todoRouter.get("/", async (req, res) => {
    const todos = await todoModel.find()
    res.send(todos)
})


todoRouter.post("/create", async (req, res) => {
    const payload = req.body
    try {
        const new_todo = new todoModel(payload)
        await new_todo.save()
        res.send({ "msg": "Todo Done" })
    }
    catch (err) {
        console.log(err)
        res.send({ "err": "Something went wrong" })
    }
})


todoRouter.patch("/update/:todoID", async (req, res) => {
    const todoID = req.params.todoID
    const payload = req.body
    try {
        const query = await todoModel.findByIdAndUpdate({ _id: todoID }, payload)
        console.log(query)
        res.send({ "msg": "Note Updated" })
    }
    catch (err) {
        console.log(err)
        res.send({ "err": "Something went wrong" })
    }
})



todoRouter.delete("/delete/:todoID", async (req, res) => {
    const todoID = req.params.todoID
    try {
        const query = await todoModel.findByIdAndDelete({ _id: todoID })
        console.log(query)
        res.send({ "msg": "Note Deleted" })
    }
    catch (err) {
        console.log(err)
        res.send({ "err": "Something went wrong" })
    }
})



module.exports = { todoRouter }