import { ORM } from 'redux-orm';
import Board from './Board';
import Column from './Column';
import Project from './Project';
import Todo from './Todo';
import User from './User';
import Type from './Type';
import Tag from './Tag';


const orm = new ORM();
orm.register(Board, Column, Project, Todo, User, Type, Tag);

export default orm;
