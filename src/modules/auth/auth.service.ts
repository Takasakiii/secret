import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DiscordBotService } from "src/extension-modules/discord/discord-bot.service";
import { UserService } from "../users/user.service";
import { JwtService } from '@nestjs/jwt'
import { User } from "../users/schemas/User.schema";
import { JwtPayload } from "./jwt.payload";

@Injectable()
export class AuthService {
    constructor (private readonly discordService: DiscordBotService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService) {}

    
    async validateUser(code: string){
        const discordUser = await this.discordService.getUserLogin(code)

        const userDb = await this.userService.login(discordUser)

        return userDb
    }


    async getUser(id: string){
        const userDb = await this.userService.show(id, false)

        if(!userDb)
            throw new HttpException('User undefined', HttpStatus.BAD_REQUEST)

        return userDb
    }

    async login(user: User){
        return {
            access_token: this.jwtService.sign({
                role: user.details.role,
                sub: user._id
            } as JwtPayload)
        }
    }
}