export type { Zone, Checkpoint, Subject, Student, Group, Talk } from "./model/types";
export { GROUPS, STUDENTS, studentZone, findStudentByFullName } from "./model/mock-data";
export { addTalk, useTalksForStudent, useAllTalks } from "./model/talks-store";
