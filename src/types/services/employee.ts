export interface IEmployeeResponse{
    seq: number;
    hospitalSeq: number;
    departmentSeq: number;
    name: string;
    position: string;
    unitTime: number;
    type?: string;
    priority?: number;
}