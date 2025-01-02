import {  Request, Response } from "express";
const Permission = require("./models/permissionModel");
const Role = require("./models/roleModel");
const _ = require("underscore");

async function create(req: Request, res: Response) {
    try {
        await Permission.deleteMany({});

        await Permission.insertMany
        (
            [
            { name: 'user' },
        ]);

        res.status(201).json({ message: "Permission seeder run successfully."});

    }
    catch (err: any) {
        console.log(err)
        return res.status(409).json({ message: "Something went wwrong" });

    }
}

// async function permissionUpdate(req: Request, res: Response) {
//     try {
//         let { _id } = req.query;
//         console.log(1);

//         const { name } = req.body;
//         const exist = await Permission.findById({ _id: _id });


//         exist.name = name ? name : exist.name;
//         await exist.save();
//         return commonUtils.sendAdminSuccess(req, res, { message: AppStrings.PERMISSION_UPDATE });
//     }
//     catch (err: any) {
//         console.log(err);
//         return commonUtils.sendAdminError(req, res, { message: AppStrings.SOMETHING_WENT_WRONG }, 409);
//     }
// }

// async function list(req: Request, res: Response) {
//     try {
//         const permission = await Permission.find({}).select("name status").sort({ createdAt: -1 });
//         if (permission) {
//             let permission_object: any = {};
//             const names = _.pluck(permission, "name");
//             await names.forEach((n: any) => {
//                 permission_object[n] = "00000";
//             })
//             return commonUtils.sendAdminSuccess(req, res, { permission: permission, permission_name: names, permission_object: permission_object }, 200);
//         }
//         else {
//             return commonUtils.sendAdminError(req, res, { message: AppStrings.PERMISSION_NOT_EXISTS }, 409);
//         }
//     }
//     catch (err: any) {
//         console.log(err)
//         return commonUtils.sendAdminError(req, res, { message: AppStrings.SOMETHING_WENT_WRONG }, 409);
//     }
// }

// async function remove(req: Request, res: Response) {
//     try {
//         const { _id } = req.params;
//         const exist = await Permission.findOneAndDelete({ _id });
//         if (exist) {
//             let p_name = "permission." + exist.name;
//             const Roles = await Role.update({}, { $unset: { [p_name]: 1 } }, { multi: true });
//             return commonUtils.sendAdminSuccess(req, res, { message: AppStrings.PERMISSION_DELETE }, 200);
//         }
//         else {
//             return commonUtils.sendAdminError(req, res, { message: AppStrings.PERMISSION_NOT_EXISTS }, 409);
//         }
//     }
//     catch (err: any) {
//         console.log(err);
//         return commonUtils.sendAdminError(req, res, { message: AppStrings.SOMETHING_WENT_WRONG });
//     }
// }

// const activeInactivePermission = async function (req: Request, res: Response) {
//     try {
//         const _id = req.params._id;
//         const permission = await Permission.findById({ _id: _id });
//         if (!permission) return commonUtils.sendAdminError(req, res, { message: AppStrings.PERMISSION_NOT_EXISTS });
//         permission.status = permission.status ? 0 : 1;
//         let msg = permission.status ? "Active" : "De-Active";
//         await permission.save();
//         return commonUtils.sendAdminSuccess(req, res, { message: "Permission status " + msg + " succesfully" }, 200);
//     }
//     catch (err: any) {
//         console.log(err);
//         return commonUtils.sendAdminSuccess(req, res, { message: AppStrings.SOMETHING_WENT_WRONG });
//     }
// }

export default {
    create
    // permissionUpdate,
    // list,
    // remove,
    // activeInactivePermission
}