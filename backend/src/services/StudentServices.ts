import { IdType } from "../models/Common";
import { StudentType } from "../models/StudentModels";
import {
    create,
    deleteDB,
    get,
    getAll,
    replace,
    update,
} from "./GenericServices";

export const getStudents = async (): Promise<
    StudentType[] | null | undefined
> => {
    return await getAll("student");
};

export const getStudent = async (
    id: IdType
): Promise<StudentType | null | undefined> => {
    return await get("student", id);
};

export const createStudent = async (newStudent: Omit<StudentType, "id">) => {
    return await create<StudentType>("student", newStudent);
};

export const replaceStudent = async (
    id: IdType,
    newStudent: Omit<StudentType, "id">
) => {
    return await replace<StudentType>("student", id, newStudent);
};

export const updateStudent = async (
    id: IdType,
    newStudent: Partial<Omit<StudentType, "id">>
) => {
    return await update<StudentType>("student", id, newStudent);
};

export const deleteStudent = async (id: IdType) => {
    return await deleteDB("student", id);
};
