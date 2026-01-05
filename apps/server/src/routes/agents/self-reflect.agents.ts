import express, { Router } from 'express';
import zod from 'zod';

const router: Router = express.Router(); 

const inputObj = zod.object({
    conversation: zod.array(zod.object({role: zod.string(), payload: zod.string()})),
    use_case_id: zod.number().optional(),
});

router.post('/', async (req, res) => {

});

export default router;