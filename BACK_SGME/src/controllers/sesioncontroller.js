const request = require('request');
const servicessesion = require('../services/sesionservices');

const login2 = async (req , res) => {
    try {        
        const tokendatos = req.body;
        const token = await servicessesion.login2(tokendatos);
        res.json(token);
       // res.send(token);
    }catch (error){
    }  
  }  
  
  const perfilusuario = async (req , res) => {
    try {
        console.log(req.body);
        const usuario = req.body;
        const perfildatos = await servicessesion.perfilusuario(usuario);
        res.json(perfildatos);
       // res.send(token);
    }catch (error){
    }  
  }  
  
  const perfilesmenus = async (req , res) => {
    try {
        const usuario = req.body;
        const perfildatos = await servicessesion.perfilesmenus(usuario);
        res.json(perfildatos);
       // res.send(token);
    }catch (error){
    }  
  }  

  const crearusuario = async (req , res) => {
    try {
        const usuario = req.body;
        const perfildatos = await servicessesion.crearusuario(usuario);
        res.json(perfildatos);
       // res.send(token);
    }catch (error){
    }  
  }  

  const listadomenususuarios = async (req , res) => {
    try {        
        const usuario = req.body;
        const perfildatos = await servicessesion.listadomenususuarios(usuario);
        res.json(perfildatos);
       // res.send(token);
    }catch (error){
    }  
  }  

  const actualizarmenususuarios = async (req , res) => {
    try {
        const usuario = req.body;
        const perfildatos = await servicessesion.actualizarmenususuarios(usuario);
        res.json(perfildatos);
       // res.send(token);
    }catch (error){
    }  
  } 
  
  const verificarperfilusuario = async (req , res) => {
    try {
        const usuario = req.body;
        const perfildatos = await servicessesion.verificarperfilusuario(usuario);
        res.json(perfildatos);
       // res.send(token);
    }catch (error){
    }  
  } 

  const actualizarperfilusuario = async (req , res) => {
    try {
        const usuario = req.body;
        const perfildatos = await servicessesion.actualizarperfilusuario(usuario);
        res.json(perfildatos);
       // res.send(token);
    }catch (error){
    }  
  } 
  

  
  module.exports = {
      login2,
      perfilesmenus,
      crearusuario,
      listadomenususuarios,
      actualizarmenususuarios,
      verificarperfilusuario,
      actualizarperfilusuario,
      perfilusuario 
  } 