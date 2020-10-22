import { IJwt } from './../interfaces/jwt.interface';
import { MESSAGES, SECRET_KEY, EXPIRETIME } from './../config/constants';
import jwt from 'jsonwebtoken';

class JWT{
  private secretKey = SECRET_KEY as string;
  //Informacion de payload con fecha de caducidad de 24h por defecto
  sign(data: IJwt, expiresIn: number = EXPIRETIME.H24){
    return jwt.sign(
      { user: data.user },
      this.secretKey,
      { expiresIn } 
    );
  }

  verify(token: string){
    try{
      return jwt.verify(token, this.secretKey);
    }catch(e){
      return MESSAGES.TOKEN_VERIFICATION_FAILED;
    }
  }

}

export default JWT;