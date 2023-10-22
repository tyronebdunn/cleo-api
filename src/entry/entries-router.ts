import {Router} from "express";
import {
    getEntriesHandler,
    getEntryHandler,
    createEntryHandler,
    updateEntryHandler,
    deleteEntryHandler,
    deleteEntriesHandler
} from "./entries-request-handlers";

const entriesRouter: Router = Router();
entriesRouter.get('/:id', getEntryHandler);
entriesRouter.get('', getEntriesHandler);
entriesRouter.post('/:id', createEntryHandler);
entriesRouter.delete('/', deleteEntriesHandler);
entriesRouter.delete('/:id', deleteEntryHandler);
entriesRouter.patch('/:id', updateEntryHandler);

export default entriesRouter;