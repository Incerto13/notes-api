import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.ENV}`],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
            type: 'postgres',
            autoLoadEntities: true,
            synchronize: true,
            entities: [process.cwd() + '/**/*.entity{.ts}'],
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
        })
      })
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'postgres',
    //   database: 'test-int',
    //   autoLoadEntities: true,
    //   entities: [process.cwd() + '/**/*.entity{.ts}'],
    //   synchronize: true,
    // }),
  ],
})
export class TestModule {}

// @Module({
//     imports: [
//       ConfigModule.forRoot({
//         envFilePath: '.int.env',
//         isGlobal: true,
//       }),
//       TypeOrmModule.forRoot({
//         type: 'postgres',
//         host: 'localhost',
//         port: 5432,
//         username: 'postgres',
//         password: 'postgres',
//         database: 'test-int',
//         autoLoadEntities: true,
//         entities: [process.cwd() + '/**/*.entity{.ts}'],
//         synchronize: true,
//       }),
//     ],
//   })
//   export class TestModule {}