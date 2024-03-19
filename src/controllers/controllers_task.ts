import { RequestHandler, Response } from "express";
import { Document } from "mongoose";
import TasksModel from "../models/tasks";
import createHttpError from "http-errors";
import APIFeatures from "../util/APIFeature";
import { catchAsync } from "../util/catchAsync";
import AppError from "../util/appError";

const sendSuccessResponse = (tasks:Document, statusCode:number, res:Response) => {
  res.status(statusCode).json({
    status: "Success",
    tasks
  })
};

// interface newTaskBody {
//   resources: [
//     {
//       title?: string;
//       pokemon?: [string];
//       office?: string;
//       eventColor?: string;
//       manhour?: number;
//       progress?: number;
//       status?: string;
//       workload?: number;
//       children: [
//         {
//           title?: string;
//           pokemon?: [string];
//           office?: string;
//           eventColor?: string;
//           manhour?: number;
//           progress?: number;
//           status?: string;
//           workload?: number;
//         }
//       ];
//     }
//   ];
//   events: [
//     {
//       start?: Date;
//       end?: Date;
//       title?: string;
//       memo?: string;
//     }
//   ];
// }

export const createTask: RequestHandler = catchAsync(async (req, res) => {
    const newTask = await TasksModel.create(req.body); 
    sendSuccessResponse(newTask,201, res);
});

// Get all Resources and Events data from server and support few filtering functions
// interface GetTasksQueryParams {
//   page?: string;
//   sort?: string;
//   limit?: string;
//   field?: string;
//   [key: string]: string | undefined; // 其他可能的查询参数
// }
export const getAllTasks: RequestHandler = catchAsync(async (req, res, next) => {
    const gettingTasks = new APIFeatures(TasksModel.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const tasks = await gettingTasks.query;

    if (tasks.length === 0) {
      next(new AppError("There is no resources in the database",404))
    }
    res.status(200).json(tasks)

})

// Add new Child Resource
interface addNewChildParams {
  resourcesId: string;
}
interface addNewResourceChild {
  id: string;
  title: string;
  pokemon: string[];
  office: string;
  manhour: number;
  progress: number;
  status: string;
  workload: number;
}

interface existedResource {
  id: string;
  title: string;
  pokemon: string[];
  office: string;
  manhour: number;
  progress: number;
  status: string;
  workload: number;
  children: addNewResourceChild[];
}

interface addEventChild {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: string;
  memo: string;
}

interface addNewChildBody {
  resources: existedResource[];
  events: addEventChild[];
}

export const createNewChildTask: RequestHandler<addNewChildParams,unknown,addNewChildBody,unknown> = async (req, res, next) => {
  try {
    const addChild = req.params.resourcesId;
    if (!addChild) {
      throw createHttpError(404, "what are u doing man?");
    }
    const filter = { "resources.id": addChild };
    
    const newChild = req.body.resources[0].children;
    const newEvent = req.body.events;

    const task = await TasksModel.findOne(filter).exec();
    if (task) {
      if (newChild) {
        task.resources[0].children =
          task.resources[0].children.concat(newChild);
      }
      if (newEvent) {
        task.events = task.events.concat(newEvent);
      }
      await task.save();
      res.status(200).json(task);
    } else {
      throw createHttpError(404, "Task has not been found!");
    }
  } catch (error) {
    next(error);
  }
};

//Update Resource when clicks Edit Icon
interface updateResourceParams {
  taskId: string;
}

interface updateResourceChild {
  id: string;
  title: string;
  pokemon: string[];
  office: string;
  manhour: number;
  progress: number;
  status: string;
  workload: number;
}

interface updateResource {
  id: string;
  title: string;
  pokemon: string[];
  office: string;
  manhour: number;
  progress: number;
  status: string;
  workload: number;
  children: updateResourceChild[];
}

interface updateEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: string;
  memo: string;
}

interface updateSelectedTaskBody {
  resources: updateResource[];
  events: updateEvent[];
}
export const updateSelectedTask: RequestHandler<
  updateResourceParams,
  unknown,
  updateSelectedTaskBody,
  unknown
> = async (req, res, next) => {
  try {
    const eventResource = req.params.taskId;
    if (!eventResource) {
      throw createHttpError(404, "What are u doing man?");
    }
    const filter = {
      $or: [
        { "resources.id": eventResource },
        { "resources.children.id": eventResource },
      ],
    };
    const task = await TasksModel.findOne(filter).exec();
    if (!task) {
      throw createHttpError(404, "There is no such task");
    } else {
      // Update resources
      if (req.body.resources) {
        req.body.resources.forEach((updateResource) => {
          const resource = task.resources.find(
            (resource) => resource.id === updateResource.id
          );
          if (resource) {
            // Update resource properties
            resource.title = updateResource.title;
            resource.pokemon = updateResource.pokemon;
            resource.office = updateResource.office;
            resource.manhour = updateResource.manhour;
            resource.progress = updateResource.progress;
            resource.status = updateResource.status;
            resource.workload = updateResource.workload;

            // Update children
            if (updateResource.children) {
              updateResource.children.forEach((updateChild) => {
                const child = resource.children.find(
                  (child) => child.id === updateChild.id
                );
                if (child && child.id === eventResource) {
                  // Update child properties
                  child.title = updateChild.title;
                  child.pokemon = updateChild.pokemon;
                  child.office = updateChild.office;
                  child.manhour = updateChild.manhour;
                  child.progress = updateChild.progress;
                  child.status = updateChild.status;
                  child.workload = updateChild.workload;
                }
              });
            }
          }
        });
      }
      // Update events
      if (req.body.events) {
        req.body.events.forEach((updateEvent) => {
          const event = task.events.find(
            (event) => event.resourceId === updateEvent.resourceId
          );
          if (event && event.resourceId === eventResource) {
            // Update event properties
            event.title = updateEvent.title;
            event.start = updateEvent.start;
            event.end = updateEvent.end;
            event.resourceId = updateEvent.resourceId;
            event.memo = updateEvent.memo;
          }
        });
      }
      await task.save();
      res.status(200).json(task);
    }
  } catch (error) {
    next(error);
  }
};

// Delete selected Child Resource & associated Event
interface deleteResourceParams {
  taskId: string;
}

interface deleteResourceChild {
  id: string;
  title: string;
  pokemon: string[];
  office: string;
  manhour: number;
  progress: number;
  status: string;
  workload: number;
}

interface deleteResource {
  id: string;
  title: string;
  pokemon: string[];
  office: string;
  manhour: number;
  progress: number;
  status: string;
  workload: number;
  children: deleteResourceChild[];
}

interface deleteEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: string;
  memo: string;
}

interface deleteSelectedTaskBody {
  resources: deleteResource[];
  events: deleteEvent[];
}
export const deleteSelectedTask: RequestHandler<deleteResourceParams,unknown,deleteSelectedTaskBody,unknown> = async (req, res, next) => {
  try {
    const childResource = req.params.taskId;
    if (!childResource) {
      throw createHttpError(404, "what are u doing man?");
    }
    const filter = { "resources.children.id": childResource };

    const task = await TasksModel.findOne(filter).exec();
    if (!task) {
      throw createHttpError(404, "There is no such task");
    } else {
      // Delete Resources Child
      task.resources.forEach((resource) => {
        resource.children = resource.children.filter(
          (child) => child.id !== childResource
        );
      });
      // Delete Resources Child releated Event
      task.events = task.events.filter(
        (event) => event.resourceId !== childResource
      );
      await task.save();
      res.status(200).json(task);
    }
  } catch (error) {
    next(error);
  }
};
