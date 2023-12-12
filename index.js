const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const { createClient } = require("@supabase/supabase-js");
const app = express();

const supabase = createClient(
  "https://xphbzyvamuriuzsbqwym.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwaGJ6eXZhbXVyaXV6c2Jxd3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIyMTQ0MjAsImV4cCI6MjAxNzc5MDQyMH0.9Rp86N2US4cwN-BPOkGpk6FXNCz_NNLmhA-ryvzNUG0"
);

app.listen(3000);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "views")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

let todos = [];

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("index", { todos });
});

app.post("/home", (req, res) => {
  todos.push({ task: req.body.task, completed: false });
  res.redirect("/home");
});

app.delete("/home/:id", (req, res) => {
  todos.splice(req.params.id, 1);
  res.redirect("/home");
});

app.patch("/home/:id", (req, res) => {
  todos[req.params.id].completed = !todos[req.params.id].completed;
  res.redirect("/home");
});
