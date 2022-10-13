import joi from 'joi';

const bigUrlSchema = joi
	.object({
		url: joi
			.string()
			.pattern(/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/i)
			.required(),
	})
	.messages({ 'string.pattern.base': 'this url has not a valid url format' });

export { bigUrlSchema };
