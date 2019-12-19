import joi from 'joi';

export default abstract class ACrudValidator {
  public readonly abstract payloadCreateSchema: joi.ObjectSchema;
  public readonly abstract payloadUpdateSchema: joi.ObjectSchema;
  public readonly abstract paramsObjectIdSchema: joi.StringSchema;
  public readonly jwtSchema = joi
    .object({
      authorization: joi.string()
                        .required(),
    })
    .unknown();
}
