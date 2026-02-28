import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ThreadId = bigint;
export type IdeaId = bigint;
export type Time = bigint;
export interface Dataset {
    id: bigint;
    name: string;
    lastUpdated: bigint;
    description: string;
    category: string;
    recordCount: bigint;
}
export interface User {
    name: string;
    email: string;
    passwordHash: string;
}
export interface Message {
    id: bigint;
    content: string;
    author: string;
    timestamp: Time;
    threadId: ThreadId;
}
export interface Problem {
    id: ProblemId;
    title: string;
    submittedBy: string;
    description: string;
}
export interface ThreadView {
    id: bigint;
    title: string;
    messages: Array<Message>;
    problemId: ProblemId;
}
export type ProblemId = bigint;
export interface Idea {
    id: IdeaId;
    title: string;
    feasibilityScore: bigint;
    description: string;
    problemId: ProblemId;
    category: string;
}
export interface backendInterface {
    addDataset(id: bigint, name: string, description: string, category: string, recordCount: bigint, lastUpdated: bigint): Promise<void>;
    createThread(title: string, problemId: ProblemId): Promise<ThreadId>;
    getDatasetById(id: bigint): Promise<Dataset>;
    getProblemById(id: ProblemId): Promise<Problem>;
    getThreadMessages(threadId: ThreadId): Promise<Array<Message>>;
    getUserProfile(email: string): Promise<User>;
    listDatasets(): Promise<Array<Dataset>>;
    listIdeasByProblemId(problemId: ProblemId): Promise<Array<Idea>>;
    listProblems(): Promise<Array<Problem>>;
    listThreads(): Promise<Array<ThreadView>>;
    postMessage(threadId: ThreadId, content: string, author: string): Promise<void>;
    registerUser(name: string, email: string, passwordHash: string): Promise<void>;
    storeIdea(problemId: ProblemId, title: string, description: string, feasibilityScore: bigint, category: string): Promise<IdeaId>;
    submitProblem(title: string, description: string, submittedBy: string): Promise<ProblemId>;
    validateLogin(email: string, passwordHash: string): Promise<boolean>;
}
