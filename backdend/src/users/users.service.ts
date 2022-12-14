import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { CreateUsersDto, UpdatePasswordDto, UpdateUsersDto } from './dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>
    ) {}

    async create(donnees: CreateUsersDto): Promise<void> {
        await this.usersRepository
        .createQueryBuilder()
        .insert()
        .into(Users)
        .values({
            nom: donnees.nom,
            prenoms: donnees.prenoms,
            email: donnees.email,
            tel: donnees.tel,
            password: () => 'SHA2('+donnees.password+', 256)'
        })
        .execute();
    }

    async findall(): Promise<Users[]> {
        return await this.usersRepository
        .createQueryBuilder('u')
        .select([
            'u.id as id', 'u.nom as nom', 'u.prenoms as prenoms',
            'u.email as email', 'u.tel as tel', 'u.facebook as facebook',
            'u.photo_path as photo_path'
        ])
        .getRawMany();
    }

    async findone(donnees: { id: number }): Promise<Users> {
        return await this.usersRepository
        .createQueryBuilder('u')
        .select([])
        .where(`u.id=:identifiant`, { identifiant: donnees.id })
        .getRawOne();
    }

    async update(donnees: UpdateUsersDto, user_id: number): Promise<void> {
        await this.usersRepository
        .createQueryBuilder()
        .update(Users)
        .set({
            email: donnees.email,
            tel: donnees.tel,
            facebook: donnees.facebook
        })
        .where(`id=:identifiant`, { identifiant: user_id })
        .execute();
    }

    async update_password(donnees: UpdatePasswordDto, user_id: number): Promise<void> {
        const verify: Users = await this.usersRepository
        .createQueryBuilder('u')
        .select(['u.id'])
        .where(`u.id=:identifiant AND u.password=SHA2(:password, 256)`, {
            identifiant: user_id,
            password: donnees.last_password
        })
        .getRawOne();

        if(!verify) throw new ForbiddenException('Credentials incorrects !');
        await this.usersRepository
        .createQueryBuilder()
        .update(Users)
        .set({
            password: () => 'SHA2('+donnees.new_password+', 256)'
        })
        .where(`id=:identifiant`, { identifiant: user_id })
        .execute();
    }

    async verifyPhoto_path(user_id: number): Promise<Users> {
        return await this.usersRepository
        .createQueryBuilder('u')
        .select(['u.photo_path as photoPath'])
        .where(`u.id=:identifiant`, { identifiant: user_id })
        .getRawOne();
    }

    async update_photo(path_file: string, user_id: number): Promise<void> {
        await this.usersRepository
        .createQueryBuilder()
        .update(Users)
        .set({
            photoPath: path_file
        })
        .where(`id=:identifiant`, { identifiant: user_id})
        .execute();
    }
}
