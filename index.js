const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://xphbzyvamuriuzsbqwym.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwaGJ6eXZhbXVyaXV6c2Jxd3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIyMTQ0MjAsImV4cCI6MjAxNzc5MDQyMH0.9Rp86N2US4cwN-BPOkGpk6FXNCz_NNLmhA-ryvzNUG0"
);
const app = express();
app.use(methodOverride("_method"));

app.listen(3000);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "views")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/home", checkAuthenticated, grabTodos, (req, res) => {
  res.render("index", { todos: req.todos });
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.post("/home", async (req, res) => {
  const { error } = await supabase
    .from("todos")
    .insert({ task: req.body.task });
  res.redirect("/home");
});

app.delete("/home/:id", deleteTask, (req, res) => {
  res.redirect("/home");
});

app.patch("/home/:id", markComplete, (req, res) => {
  res.redirect("/home");
});

app.get("/register", (req, res) => {
  res.render("register", { error: null });
});

app.post("/register", async (req, res) => {
  const { email, password, password2 } = req.body;
  if (password !== password2) {
    res.render("register", { error: "Passwords do not match!" });
  } else {
    const error = await signUpNewUser(email, password);
    if (error) {
      res.render("register", { error });
    } else {
      res.redirect("/login");
    }
  }
});

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const error = await signInWithEmail(email, password);
  if (error) {
    res.render("login", { error });
  } else {
    res.redirect("/home");
  }
});

app.post("/logout", async (req, res) => {
  const error = await signOut();
  if (error) {
    res.render("login", { error });
  } else {
    res.redirect("/login");
  }
});

async function signUpNewUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Error signing up:", error.message);
    return error.message;
  }
  return null;
}

async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Error logging in:", error.message);
    return error.message;
  }
  return null;
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
}

async function checkAuthenticated(req, res, next) {
  const { data, error } = await supabase.auth.getSession();
  if (data.session) {
    next();
  } else {
    console.error("Error getting session:", error);
    return res.redirect("/login");
  }
}

async function grabTodos(req, res, next) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("todos")
    .select("task, completed")
    .eq("id", user.id);

  if (error) {
    console.error(error);
    next(error);
  } else {
    req.todos = data;
    next();
  }
}

async function markComplete(req, res, next) {
  const { data, error } = await supabase
    .from("todos")
    .update({ completed: true })
    .eq("task", req.params.id);
  next();
}

async function deleteTask(req, res, next) {
  const { data, error } = await supabase
    .from("todos")
    .delete()
    .eq("task", req.params.id);
  next();
}
