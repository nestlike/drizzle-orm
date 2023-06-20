[<img height="48" src="https://raw.githubusercontent.com/nestjs/docs.nestjs.com/master/src/assets/logo.svg" alt="NestJS"/>](http://nestjs.com)
<img height="48" src="https://raw.githubusercontent.com/Remix-Design/RemixIcon/master/icons/System/add-fill.svg" alt="+">
[<img height="48" src="https://raw.githubusercontent.com/drizzle-team/drizzle-orm-docs/master/public/favicon.svg" alt="Drizzle ORM"/>](http://orm.drizzle.team)

# @nestlike/drizzle-orm

Bring your [NestJS](https://nestjs.com) app to the next level by integrating [Drizzle ORM](https://orm.drizzle.team).

## Installation

First you must install the package and it's peer dependencies.

```bash
npm i @nestlike/drizzle-orm drizzle-orm
```

After that you should also install a database client. You can find more information about that and available options in the offical
[documentation](https://orm.drizzle.team/docs/installation-and-db-connection).

Let's assume you want to use [Postgres.js](https://github.com/porsager/postgres).

```bash
npm i postgres
```

Of course you can also install and work with [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview). This module is just a thin wrapper and won't stand in your way.

## Configuration

Now you can import the module and confgure it in your application. In a new application created with the NestJS CLI that could look like the following.

```ts
import { Module } from '@nestjs/common';
import { DrizzleModule } from '@nestlike/drizzle-orm';
import postgres from 'postgres';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        DrizzleModule.forRoot({
            driver: 'postgres-js',
            client: postgres('postgres://postgres:adminadmin@0.0.0.0:5432/db')
        })
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule { }
```

Notice that you don't have to create a drizzle instance. That is done behind the scenes to make things easier. All you need to do is configure
the driver you want to use and provide a client. Asynchronous confiiguration is also possible using the `forRootAsync` method.

## Adding Schemas

After the module is configured you can add schemas in your feature modules. Let's assume you have created a `UsersModule` and a `PostsModule` by
generating resources with the NestJS CLI.

### Defining the tables for your entities

NestJS has created the files `.src/users/entities/user.entity.ts` and `.src/posts/entities/post.entity.ts` for you. To get the most out of code
scaffolding we will just use them for defining our tables like we would with TypeORM.

Of course you are completely free to chose a folder structure and naming convention that makes sense for yourself. You could
for example move those files to `./src/users/schema/users.table.ts` adn `./src/posts/schema/posts.table.ts`.

Now let's have a look at how we would implement the [relational queries](https://orm.drizzle.team/docs/rqb) examples from Drizzle's documentation.

We will start with our `.src/users/entities/user.entity.ts`:

```ts
import { relations } from 'drizzle-orm';
import { serial, text, pgTable } from 'drizzle-orm/pg-core';

import { postEntity } from '../../posts/entities/post.entity';

export const userEntity = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull()
});

export const userRelations = relations(userEntity, ({ many }) => ({
    posts: many(postEntity)
}));
```

Our `.src/posts/entities/post.entity.ts` would look like this:

```ts
import { relations } from 'drizzle-orm';
import { integer, serial, text, pgTable } from 'drizzle-orm/pg-core';

import { userEntity } from '../../users/entities/user.entity';

export const postEntity = pgTable('posts', {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    authorId: integer('author_id').notNull()
});

export const postRelations = relations(postEntity, ({ one }) => ({
    author: one(userEntity, { fields: [postEntity.authorId], references: [userEntity.id] })
}));
```

And that's it! We defined our entities the NestJS way by organizing them in feature modules instead of a single
schema file. Pretty neat, isn't it?

### Informing DrizzleModule about your schema

The only thing missing now is letting DrizzleModule know about your schema. For that we can use the `forFeature` or
`forFeatureAsync` method when importing the module in our feature module.

Let's have a look at `./src/users/users.module.ts`:  

```ts
import { Module } from '@nestjs/common';
import { DrizzleModule } from '@nestlike/drizzle-orm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// We can just import the entire module here if it only exports tables
// and relations and therefore is a valid schema that we can provide to
// the drizzle instance behind the scenes.
import * as schema from './entities/user.entity';

// In case you have other exports or multiple entities defined in your feature
// module you must handcraft your schema object. This gives you complete freedom
// and makes it even possible to rename keys.
import { userEntity, userRelations } from './entities/user.entity';

const schema2 = { users: userEntity, userRelations };

// Next we leverage declaration merging to make sure that Drizzle's type
// system knows about the feature's entities and their relationships.
declare module '@nestlike/drizzle-orm' {
    interface DrizzleSchema extends Required<typeof schema> { }
}

@Module({
    imports: [DrizzleModule.forFeature(schema)],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule { }
```

For `./src/posts/posts.module.ts` we do the same:

```ts
import { Module } from '@nestjs/common';
import { DrizzleModule } from '@nestlike/drizzle-orm';

import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import * as schema from './entities/post.entity';

declare module '@nestlike/drizzle-orm' {
    interface DrizzleSchema extends Required<typeof schema> { }
}

@Module({
    imports: [DrizzleModule.forFeature(schema)],
    controllers: [PostsController],
    providers: [PostsService]
})
export class PostsModule { }
```

### Querying the database

Finally we can access the drizzle instance in our application. For example in `./src/users/users.service.ts`:

```ts
import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';

// Notice that we import PostgresJsDatabase from '@nestlike/drizzle-orm' and
// not from 'drizzle-orm/postgres-js'. The difference is that it is not generic
// and already knows the type  for our schema because we merged our custom
// declarations earlier.
import { DRIZZLE_DB, PostgresJsDatabase } from '@nestlike/drizzle-orm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userEntity } from './entities/user.entity';

@Injectable()
export class UsersService {

    constructor(@Inject(DRIZZLE_DB) private db: PostgresJsDatabase) { }

    async create(createUserDto: CreateUserDto) {
        return this.db.insert(userEntity).values(createUserDto).returning();
    }

    async findAll() {
        return this.db.query.userEntity.findMany({ with: { posts: true } });
    }

    async findOne(id: number) {
        return this.db.query.userEntity.findFirst({ where: eq(userEntity.id, id) });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        return this.db.update(userEntity).set(updateUserDto).where(eq(userEntity.id, id)).returning();
    }

    async remove(id: number) {
        return this.db.delete(userEntity).where(eq(userEntity.id, id)).returning();
    }

}
```

## Running

Finally you can start your application.

```bash
nest start
```

## Using Drizzle Kit

Drizzle Kit works just as expected. You must only make sure that it picks up your schema files by providing
a correct configuration. For example:

```ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/**/entities/*.entity.ts',
  out: './drizzle'
} satisfies Config;
```

## Bonus

One more nice thing that Drizzle gives us is an integration with [Zod](https://zod.dev). Nothing stops us from
using it as well. Since this is opt-in you will not find a full blown tutorial here and just some basic ideas.
You should install two more packages:

```bash
npm i drizzle-zod nestjs-zod
```

After that you can define your DTOs like this:

```ts
import { createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { userEntity } from '../entities/user.entity';
import { postEntity } from '../../posts/entities/post.entity';

const userSchema = createSelectSchema(userEntity)
    .and(z.object({ posts: z.array(createSelectSchema(postEntity)) }));

export class UserDto extends createZodDto(userSchema) { }
```

You can read more about validation and even full Swagger support [here](https://github.com/risen228/nestjs-zod).
