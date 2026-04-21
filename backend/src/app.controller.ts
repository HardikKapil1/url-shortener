// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
	@Get()
	generate() {
		return { message: 'Generated successfully' };
	}
}
