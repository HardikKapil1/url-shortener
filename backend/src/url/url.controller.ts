// url.controller.ts
import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import type { Response } from 'express';
import { Ip } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class UrlController {
    constructor(private readonly urlService: UrlService) { }
    @Throttle({
        default: {
            limit: 5,
            ttl: 60,
        },
    })
    @Post('shorten')
    shorten(@Body() body: { originalUrl: string }) {
        return this.urlService.shorten(body.originalUrl);
    }

    @Get(':code')
    async redirect(
        @Param('code') code: string,
        @Res() res: Response,
        @Ip() ip: string,
    ) {
        const url = await this.urlService.redirect(code, ip);
        return res.redirect(302, url.originalUrl);
    }

    @Get(':code/stats')
    getStats(@Param('code') code: string) {
        return this.urlService.getStats(code);
    }
}