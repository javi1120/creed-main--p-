const servicessesion = require('../services/inventarioservices');

const crearcategoria = async (req , res) => {
    try {
        console.log(req.body);
        const categoria = req.body;
        const perfildatos = await servicessesion.crearcategoria(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const crearsubcategoria = async (req , res) => {
    try {
        console.log(req.body);
        const subcategoria = req.body;
        const perfildatos = await servicessesion.crearsubcategoria(subcategoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const creararticulo = async (req , res) => {
    try {
        console.log(req.body);
        const categoria = req.body;
        const perfildatos = await servicessesion.creararticulo(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const eliminarcategoria = async (req , res) => {
    try {
        console.log(req.body);
        const categoria = req.body;
        const perfildatos = await servicessesion.eliminarcategoria(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const eliminarsubcategoria = async (req , res) => {
    try {
        console.log(req.body);
        const categoria = req.body;
        const perfildatos = await servicessesion.eliminarsubcategoria(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const eliminararticulo = async (req , res) => {
    try {
        console.log(req.body);
        const categoria = req.body;
        const perfildatos = await servicessesion.eliminararticulo(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const editarsubcategoria = async (req , res) => {
    try {
        console.log(req.body);
        const categoria = req.body;
        const perfildatos = await servicessesion.editarsubcategoria(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const editarreferencia = async (req , res) => {
    try {
        console.log(req.body);
        const referencia = req.body;
        const perfildatos = await servicessesion.editarreferencia(referencia);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const editarcategoria = async (req , res) => {
    try {
        console.log(req.body);
        const categoria = req.body;
        const perfildatos = await servicessesion.editarcategoria(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const editararticulo = async (req , res) => {
    try {
        console.log(req.body);
        const categoria = req.body;
        const perfildatos = await servicessesion.editararticulo(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const actualizarestadocategoria = async (req , res) => {
    try {
        console.log(req.body);
        const categoria = req.body;
        const perfildatos = await servicessesion.actualizarestadocategoria(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const actualizarestadosubcategoria = async (req , res) => {
    try {
        console.log(req.body);
        const categoria = req.body;
        const perfildatos = await servicessesion.actualizarestadosubcategoria(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const Actualizarestadoarticulo = async (req , res) => {
    try {
        console.log(req.body);
        const categoria = req.body;
        const perfildatos = await servicessesion.Actualizarestadoarticulo(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const listarsubcategorias = async (req , res) => {
    try {
        console.log(req.body);
        const subcategoria = req.body;
        const perfildatos = await servicessesion.listarsubcategorias(subcategoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const listarcategorias = async (req , res) => {
    try {
        const categoria = req.body;
        const perfildatos = await servicessesion.listarcategorias(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const listarcategoriassolicitud = async (req , res) => {
    try {
        const categoria = req.body;
        const perfildatos = await servicessesion.listarcategoriassolicitud(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const listararticulos = async (req , res) => {
    try {
        const categoria = req.body;
        const perfildatos = await servicessesion.listararticulos(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const listararticulossolicitud = async (req , res) => {
    try {
        const categoria = req.body;
        const perfildatos = await servicessesion.listararticulossolicitud(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const obtenercantidadarticulos = async (req , res) => {
    try {
        const categoria = req.body;
        const perfildatos = await servicessesion.obtenercantidadarticulos(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const listararticulosbarras = async (req , res) => {
    try {
        const categoria = req.body;
        const perfildatos = await servicessesion.listararticulosbarras(categoria);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const conteocatsubarticulos = async (req , res) => {
    try {
        const perfildatos = await servicessesion.conteocatsubarticulos();
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 

  const sectores = async (req , res) => {
    try {
        const perfildatos = await servicessesion.sectores();
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 
  
  const solicitudes = async (req , res) => {
    try {      
        const datos = req.body;
        const perfildatos = await servicessesion.solicitudes(datos);
        res.json(perfildatos);
       // res.send(perfildatos);
    }catch (error){
    }  
  } 
  
  
  module.exports = {
    crearcategoria,
    listarcategorias,
    crearsubcategoria,
    listarsubcategorias,
    listararticulosbarras,
    creararticulo,
    conteocatsubarticulos,
    editarcategoria,
    eliminarcategoria,
    actualizarestadocategoria,
    actualizarestadosubcategoria,
    eliminarsubcategoria,
    editarsubcategoria,
    listararticulos,
    Actualizarestadoarticulo,
    eliminararticulo,
    editararticulo,
    editarreferencia,
    listararticulossolicitud,
    listarcategoriassolicitud,
    obtenercantidadarticulos,
    sectores,
    solicitudes
} 
