import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Llaves} from '../config/llaves';
import {Persona, Producto} from '../models';
import {PersonaRepository, ProductoRepository} from '../repositories';
const generador = require("password-generator");
const cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");


@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(PersonaRepository)
    public personaRepository: PersonaRepository,
    @repository(ProductoRepository)
    public productoRepository: ProductoRepository
  ) { }

  /*
   * Add service methods here
   */
  GenerarClave() {
    let clave = generador(8, false);
    return clave
  }

  CifrarClave(clave: String) {
    let claveCifrada = cryptojs.MD5(clave).toString();
    return claveCifrada;
  }

  IdentificacionPersona(usuario: string, clave: string) {
    try {
      let p = this.personaRepository.findOne({where: {correo: usuario, clave: clave}});
      if (p) {
        return p;
      }
      return false;
    } catch {
      return false;
    }
  }

  GenerarTokenJWT(persona: Persona) {
    let token = jwt.sign({
      data: {
        id: persona.id,
        correo: persona.correo,
        nombre: persona.nombres + " " + persona.apellidos,
        rol: persona.rol
      }
    },
      Llaves.claveJWT);
    return token;
  }
  ValidarTokenJWT(token: string) {
    try {
      let datos = jwt.verify(token, Llaves.claveJWT);
      return datos;
    } catch {
      return false;
    }

  }



  //metodo prueba
  /*async CrearProducto(id: string) {
    try {
      //let p = await this.productoRepository.findOne({where: {nombre: roll}});
      //const partialProduct = {
      //  nombre: 'aceite',
      //  precio: 10000,
       // imagen: 'esta img'
     // }
      let priduct: Producto = new Producto();
      //console.log(priduct);
      priduct.nombre = 'aceite';
      priduct.precio = 10000;
      priduct.imagen = 'esta img';
      priduct.pedidoId = id;

      //console.log(priduct);

      let p = await this.productoRepository.create(priduct)
      if (p) {

        //return p;
      }
      //return false;
    } catch {
      //return false;
    }
  }*/
}
