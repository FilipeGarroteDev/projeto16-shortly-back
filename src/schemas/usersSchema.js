import joi from 'joi';

const newUserSchema = joi
	.object({
		name: joi.string().required(),
		email: joi.string().email().required(),
		password: joi.string().required(),
		confirmPassword: joi.string().valid(joi.ref('password')).required(),
	})
	.messages({ 'any.only': "the passwords don't match" });

export { newUserSchema };
