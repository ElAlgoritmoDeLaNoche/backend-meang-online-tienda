import { COLLECTIONS, EXPIRETIME, MESSAGES } from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import { asignDocumentId, findOneElement, insertOneElement } from '../lib/db.operations';
import JWT from '../lib/jwt';
import bcrypt from 'bcrypt';
import ResolversOperationsService from './resolvers-operations.service';

class UseersService extends ResolversOperationsService{

  private collection = COLLECTIONS.USERS;

  constructor(root: object, variables: object, context: IContextData){
    super(root, variables, context);
  }

  // Lista de usuarios
  async items(){
    const  page = this.getVariables().pagination?.page;
    const  itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(this.collection, 'usuarios', page, itemsPage);
    return { 
      info: result.info,
      status: result.status, 
      message: result.message, 
      users: result.items 
    };
  }

  // Autenticarnos
  async auth(){ 
    let info = new JWT().verify(this.getContext().token!);
    if (info === MESSAGES.TOKEN_VERIFICATION_FAILED) {
      return{
        status: false,
        message: info,
        user: null
      };
    }
    return{
      status: true,
      message: 'Usuario atenticado correctamente mediante token',
      user: Object.values(info)[0]
    };
  }

  // Iniciar Sesión
  async login(){
    try{
      const variables = this.getVariables().user;
      const user = await findOneElement(this.getDb(), this.collection, { email: variables?.email });
      
      if(user === null){
        return {
          status: false,
          message: 'Usuario no existe',
          token: null
        };
      }

      const passwordCheck = bcrypt.compareSync(variables?.password, user.password);
              
      if(passwordCheck !== null){
        delete user.password;
        delete user.birthday;
        delete user.registerDate;
      }
      
      return {
        status: passwordCheck,
        message: 
        !passwordCheck
        ? 'Password o usuario no son correctos, sesión no iniciada' 
        : 'Usuario cargado correctamente',
        token: 
        !passwordCheck
        ? null 
        : new JWT().sign({ user }, EXPIRETIME.H24),
        user:
        !passwordCheck
        ? null
        : user,
      };
    }catch(error){
      console.log(error);
      return {
        status: false,
        message: 'Error al cargar el usuario, comprobar que se estar cargando todo',
        token: null
      };
    }
  }

  // Registrar usuario
  async register(){
    const user = this.getVariables().user;

    // Comprobar que user no es null 
    if (user === null) {
      return {
        status: false,
        message: 'Usuario no defenido',
        user: null
      };
    }

    if (user?.password === null || user?.password === undefined || user?.password === '') {
      return {
        status: false,
        message: 'Usuario sin password correcto',
        user: null
      };
    }

    // Comprobar que el usuario no existe
    const userCheck = await findOneElement(this.getDb(), this.collection,  {email: user?.email});

    if (userCheck !== null) {
      return {
        status: false,
        message: `El email ${user?.email} está registrado y no puedes registrarte con este email`,
        user: null
      };
    }

    //Comprobar el ultimo usuario para asignar ID
    user!.id = await asignDocumentId(this.getDb(), this.collection, { registerDate: -1 });

    //Asignar la fecha de tipo ISO (formato) en la propiedad registerData
    user!.registerDate = new Date().toISOString();

    //Encriptar password
    user!.password = bcrypt.hashSync(user!.password, 10);

    const result = await this.add(this.collection, user || {}, 'usuario');
    return {
      status: result.status,
      message: result.message,
      user: result.item
    };
  }

  // Modificar un usuario
  async modify(){
    const user = this.getVariables().user;
    // Comprobar que user no es null 
    if (user === null) {
      return {
        status: false,
        message: 'Usuario no defenido',
        user: null
      };
    }
    const filter = { id: user?.id };
    const result = await this.update(this.collection, filter, user || {}, 'usuario');
    return {
      status: result.status,
      message: result.message,
      user: result.item
    };
  }

  // Eliminar usuario
  async delete(){
    const id = this.getVariables().id;
    if (id === undefined || id === '') {
      return {
        status: false,
        message: 'ID del usuario usuario no defenido',
        user: null
      };
    }
    const result = await this.del(this.collection, { id }, 'usuario');
    return {
      status: result.status,
      message: result.message
    };
  }
}

export default UseersService;