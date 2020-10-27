import { Db } from 'mongodb';
import { IVariables } from './../interfaces/variable.interface';
import { deleteOneElement, findOneElement, insertOneElement, updateOneElement } from './../lib/db.operations';
import { IContextData } from './../interfaces/context-data.interface';
import { findElement } from '../lib/db.operations';
import { pagination } from '../lib/pagination';

class ResolversOperationsService {
  
  private root: object;
  private variables: IVariables;
  private context: IContextData;

  constructor(root: object, variables: IVariables, context: IContextData){
    this.root = root;
    this.variables = variables;
    this.context = context;
  }

  protected getContext(): IContextData { return this.context; }

  protected getDb(): Db {
    return this.context.db!;
  }

  protected getVariables(): IVariables {
    return this.variables;
  }

  // Lista de información 
  protected async list(collection: string, listElement: string, page: number = 1, itemsPage: number = 20){
    try{
 
      const paginationData = await pagination(this.getDb(), collection, page, itemsPage);
      return {
        info: {
          page: paginationData.page,
          pages: paginationData.pages,
          itemsPage: paginationData.itemsPage,
          total: paginationData.total
        },
        status: true,
        message: `Lista de ${listElement} correctamente cargada`,
        items: await findElement(this.getDb(), collection, {}, paginationData),
      };
    }catch(error){
      return {
        info: null,
        status: false,
        message: `Lista de ${ listElement } no cargada ${error}`,
        items: null
      };
    }
  }

  // Obtener detalles del item
  protected async get(collecion: string){
    const collectionLabel = collecion.toLowerCase();
    try{
      return await findOneElement(this.getDb(), collecion, { id: this.variables.id }).then(
        result => {
          if (result) {
            return {
              status: true,
              message: `${collectionLabel} ha sido cargada correctamente con sus detalles`,
              item: result
            };
          }
          return {
            status: true,
            message: `${collectionLabel} no ah obtenido detalles porque no existe`,
            item: null
          };
        }
      );
    }catch(error){
      return {
        status: false,
        message: `Error inesperado al querer cargar los detalles de ${collectionLabel}`,
        item: null
      };
    }
  }

  // Añadir item
  protected async add(collection: string, document: object, item: string){
    try{
      return await insertOneElement(this.getDb(), collection, document).then(
        res => {
          if (res.result.ok === 1) {
            return {
              status: true,
              message:`Añadido correctamente ${item}.`,
              item: document
            };
          }
          return {
            status: false,
            message:`No se ha insertado el ${item}. intentalo de nuevo por favor`,
            item: null
          };
        }
      );
    }catch(error){
      return {
        status: false,
        message:`Error inesperado al insertar el ${item}. intentalo de nuevo por favor`,
        item: null
      };
    }
  }

  // Modificar item
  protected async update(collection: string, filter: object, objectUpdate: object, item: string){
    try{
      return await updateOneElement(
        this.getDb(),
        collection,
        filter,
        objectUpdate
      ).then(
        res => {
          if (res.result.nModified === 1 && res.result.ok) {
            return {
              status: true,
              message: `Elemento del ${item} actualizado correctamente.`,
              item: Object.assign({}, filter, objectUpdate)
            };
          }
          return {
            status: false,
            message: `Elemento del ${item} No se ha actualizado. No hay nada que actualizar`,
            item: null
          };
        }
      );
    }catch(error){
      return {
        status: false,
        message:`Error inesperado al actualizar el ${item}. intentalo de nuevo por favor`,
        item: null
      };
    }
  }

  // eliminar item
  protected async del(collection: string, filter: object, item: string){
    try{
      return await deleteOneElement(this.getDb(), collection, filter).then(
        res => {
          if (res.deletedCount === 1) {
            return {
              status: true,
              message: `Elemento del ${item} borrado correctamente.`,
            };
          }
          return {
            status: false,
            message: `Elemento del ${item} No se ha borrado. Comprueba el filtro.`,
          };
        }
      );
    }catch(error){
      return {
        status: false,
        message:`Error inesperado al eliminar el ${item}. intentalo de nuevo por favor`,
      };
    }
  }
}

export default ResolversOperationsService;