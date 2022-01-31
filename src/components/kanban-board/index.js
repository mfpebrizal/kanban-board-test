import React, { Component } from "react";
import "./index.css";

export default class KanbanBoard extends Component {
  constructor() {
    super();
    // Each task is uniquely identified by its name. 
    // Therefore, when you perform any operation on tasks, make sure you pick tasks by names (primary key) instead of any kind of index or any other attribute.
    this.state = {
      newTaskInput: "",
      tasks: []
    };
    this.stagesNames = ['Backlog', 'To Do', 'Ongoing', 'Done'];
    this.onClickCreateButton = this.onClickCreateButton.bind(this);
    this.onClickBackButton = this.onClickBackButton.bind(this);
    this.onClickForwardButton = this.onClickForwardButton.bind(this);
    this.onClickDeleteButton = this.onClickDeleteButton.bind(this);
  }

  onClickCreateButton() {
    if(this.state.newTaskInput) {
      const taskName = this.state.newTaskInput.trim();
      const isExists = this.findIndexByTaskName(taskName) > -1;
      if(!isExists) {
         this.setState((prevState) => {
          return {
            tasks: [...prevState.tasks, { name: taskName, stage: 0 }]
          }
        })
      }
    }
  }

  changeStage(stage, type) {
    const stagesLength = this.stagesNames.length;

    switch (type) {
      case "back":
        return Math.max(0, stage-1);
      case "forward":
        return Math.min(stagesLength-1, stage+1);
      default: 
        return; 
    }
  }

  findIndexByTaskName(name) {
    return this.state.tasks.findIndex((el) => el.name === name)
  }

  changeTask(index, updatedTask) {
    this.setState(prevState => {
      return {
        tasks: [
          ...prevState.tasks.slice(0, index),
          ...prevState.tasks.slice(index+1, prevState.tasks.length),
          ...updatedTask ? [updatedTask] : []
        ]
      }
    })
  }

  onClickBackButton(e, task) {
    e.preventDefault()
    const newStage = this.changeStage(task.stage, "back")
    const updatedTask = {
      name: task.name,
      stage: newStage
    }
    const index = this.findIndexByTaskName(task.name)
    this.changeTask(index, updatedTask)
  }

  onClickForwardButton(e, task) {
    e.preventDefault()
    const newStage = this.changeStage(task.stage, "forward")
    const updatedTask = {
      name: task.name,
      stage: newStage
    }
    const index = this.findIndexByTaskName(task.name)
    this.changeTask(index, updatedTask)
  }

  onClickDeleteButton(e, task) {
    e.preventDefault()
    const index = this.findIndexByTaskName(task.name)
    this.changeTask(index, null)
  }

  render() {
    const { tasks } = this.state;

    let stagesTasks = [];
    for (let i = 0; i < this.stagesNames.length; ++i) {
      stagesTasks.push([]);
    }
    for (let task of tasks) {
      const stageId = task.stage;
      stagesTasks[stageId].push(task);
    }

    return (
      <div className="mt-20 layout-column justify-content-center align-items-center">
        <section className="mt-50 layout-row align-items-center justify-content-center">
          <input id="create-task-input" onChange={(e) => this.setState({newTaskInput: e.target.value})} type="text" className="large" placeholder="New task name" data-testid="create-task-input"/>
          <button onClick={this.onClickCreateButton} type="submit" className="ml-30" data-testid="create-task-button">Create task</button>
        </section>

        <div className="mt-50 layout-row">
            {stagesTasks.map((tasks, i) => {
                return (
                    <div className="card outlined ml-20 mt-0" key={`${i}`}>
                        <div className="card-text">
                            <h4>{this.stagesNames[i]}</h4>
                            <ul className="styled mt-50" data-testid={`stage-${i}`}>
                                {tasks.map((task, index) => {
                                    return <li className="slide-up-fade-in" key={`${i}${index}`}>
                                      <div className="li-content layout-row justify-content-between align-items-center">
                                        <span data-testid={`${task.name.split(' ').join('-')}-name`}>{task.name}</span>
                                        <div className="icons">
                                          <button onClick={(e) => this.onClickBackButton(e, task)} disabled={task.stage === 0} className="icon-only x-small mx-2" data-testid={`${task.name.split(' ').join('-')}-back`}>
                                            <i className="material-icons">arrow_back</i>
                                          </button>
                                          <button onClick={(e) => this.onClickForwardButton(e, task)} disabled={task.stage === this.stagesNames.length-1} className="icon-only x-small mx-2" data-testid={`${task.name.split(' ').join('-')}-forward`}>
                                            <i className="material-icons">arrow_forward</i>
                                          </button>
                                          <button onClick={(e) => this.onClickDeleteButton(e, task)} className="icon-only danger x-small mx-2" data-testid={`${task.name.split(' ').join('-')}-delete`}>
                                            <i className="material-icons">delete</i>
                                          </button>
                                        </div>
                                      </div>
                                    </li>
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })}
        </div>
      </div>
    );
  }
}