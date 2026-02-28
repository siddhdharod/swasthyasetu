import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";

actor {
  type User = {
    name : Text;
    email : Text;
    passwordHash : Text;
  };

  type ProblemId = Nat;
  type Problem = {
    id : ProblemId;
    title : Text;
    description : Text;
    submittedBy : Text;
  };

  type IdeaId = Nat;
  type Idea = {
    id : IdeaId;
    problemId : ProblemId;
    title : Text;
    description : Text;
    feasibilityScore : Nat;
    category : Text;
  };

  type ThreadId = Nat;
  type Message = {
    id : Nat;
    threadId : ThreadId;
    content : Text;
    author : Text;
    timestamp : Time.Time;
  };

  type Thread = {
    id : Nat;
    title : Text;
    problemId : ProblemId;
    messages : List.List<Message>;
  };

  type ThreadView = {
    id : Nat;
    title : Text;
    problemId : ProblemId;
    messages : [Message];
  };

  type Dataset = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    recordCount : Nat;
    lastUpdated : Int;
  };

  let users = Map.empty<Text, User>();
  var nextProblemId = 1;
  var nextIdeaId = 1;
  var nextThreadId = 1;
  var nextMessageId = 1;

  let problems = Map.empty<ProblemId, Problem>();
  let ideas = Map.empty<IdeaId, Idea>();
  let threads = Map.empty<ThreadId, Thread>();
  let datasets = Map.empty<Nat, Dataset>();

  public shared ({ caller }) func registerUser(name : Text, email : Text, passwordHash : Text) : async () {
    if (users.containsKey(email)) {
      Runtime.trap("User already exists");
    };
    let user : User = { name; email; passwordHash };
    users.add(email, user);
  };

  public shared ({ caller }) func validateLogin(email : Text, passwordHash : Text) : async Bool {
    switch (users.get(email)) {
      case (null) { false };
      case (?user) { user.passwordHash == passwordHash };
    };
  };

  public query ({ caller }) func getUserProfile(email : Text) : async User {
    switch (users.get(email)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { user };
    };
  };

  public shared ({ caller }) func submitProblem(title : Text, description : Text, submittedBy : Text) : async ProblemId {
    let problem : Problem = {
      id = nextProblemId;
      title;
      description;
      submittedBy;
    };
    problems.add(nextProblemId, problem);
    nextProblemId += 1;
    problem.id;
  };

  public query ({ caller }) func listProblems() : async [Problem] {
    problems.values().toArray();
  };

  public query ({ caller }) func getProblemById(id : ProblemId) : async Problem {
    switch (problems.get(id)) {
      case (null) { Runtime.trap("Problem not found") };
      case (?problem) { problem };
    };
  };

  public shared ({ caller }) func storeIdea(problemId : ProblemId, title : Text, description : Text, feasibilityScore : Nat, category : Text) : async IdeaId {
    if (feasibilityScore > 100) {
      Runtime.trap("Feasibility score must be between 0 and 100");
    };
    let idea : Idea = {
      id = nextIdeaId;
      problemId;
      title;
      description;
      feasibilityScore;
      category;
    };
    ideas.add(nextIdeaId, idea);
    nextIdeaId += 1;
    idea.id;
  };

  public query ({ caller }) func listIdeasByProblemId(problemId : ProblemId) : async [Idea] {
    ideas.values().toArray().filter(func(idea) { idea.problemId == problemId });
  };

  public shared ({ caller }) func createThread(title : Text, problemId : ProblemId) : async ThreadId {
    let thread : Thread = {
      id = nextThreadId;
      title;
      problemId;
      messages = List.empty<Message>();
    };
    threads.add(nextThreadId, thread);
    nextThreadId += 1;
    thread.id;
  };

  public shared ({ caller }) func postMessage(threadId : ThreadId, content : Text, author : Text) : async () {
    let message : Message = {
      id = nextMessageId;
      threadId;
      content;
      author;
      timestamp = Time.now();
    };

    switch (threads.get(threadId)) {
      case (null) { Runtime.trap("Thread not found") };
      case (?thread) {
        thread.messages.add(message);
        threads.add(threadId, thread);
        nextMessageId += 1;
      };
    };
  };

  public query ({ caller }) func listThreads() : async [ThreadView] {
    threads.values().toArray().map(
      func(thread) {
        {
          id = thread.id;
          title = thread.title;
          problemId = thread.problemId;
          messages = thread.messages.toArray();
        };
      }
    );
  };

  public query ({ caller }) func getThreadMessages(threadId : ThreadId) : async [Message] {
    switch (threads.get(threadId)) {
      case (null) { Runtime.trap("Thread not found") };
      case (?thread) { thread.messages.toArray() };
    };
  };

  public shared ({ caller }) func addDataset(id : Nat, name : Text, description : Text, category : Text, recordCount : Nat, lastUpdated : Int) : async () {
    let dataset : Dataset = {
      id;
      name;
      description;
      category;
      recordCount;
      lastUpdated;
    };
    datasets.add(id, dataset);
  };

  public query ({ caller }) func listDatasets() : async [Dataset] {
    datasets.values().toArray();
  };

  public query ({ caller }) func getDatasetById(id : Nat) : async Dataset {
    switch (datasets.get(id)) {
      case (null) { Runtime.trap("Dataset not found") };
      case (?dataset) { dataset };
    };
  };
};
