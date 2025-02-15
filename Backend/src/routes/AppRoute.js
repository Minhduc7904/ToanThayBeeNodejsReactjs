import express from 'express';
import * as NguoiDungController from '../controllers/NguoiDungController.js';
import * as DeController from '../controllers/DeController.js';
import * as CauHoiController from '../controllers/CauHoiController.js';
import * as LopController from '../controllers/LopController.js';
import * as BaoCaoNDController from '../controllers/BaoCaoNDController.js';
import * as BaoCaoCHController from '../controllers/BaoCaoCHController.js';
import * as BuoiHocController from '../controllers/BuoiHocController.js';
import * as LuotLamBaiController from '../controllers/LuotLamBaiController.js';
import * as CauTraLoiController from '../controllers/CauTraLoiController.js';
import * as LoiController from '../controllers/LoiController.js';
import * as MucHocTapController from '../controllers/MucHocTapController.js';
import * as CodeController from '../controllers/CodeController.js';
import * as MenhDeController from '../controllers/MenhDeController.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import validate from '../middlewares/validate.js';
import PostCodeRequest from "../dtos/requests/PostCodeRequest";


const router = express.Router();

export const AppRoute = (app) => {
    // De routes
    router.get('/v1/de', asyncHandler(DeController.getDe));
    router.get('/v1/de/:id', asyncHandler(DeController.getDeById));
    router.post('/v1/de', asyncHandler(DeController.postDe));
    router.put('/v1/de/:id', asyncHandler(DeController.putDe));
    router.delete('/v1/de/:id', asyncHandler(DeController.deleteDe));

    // CauHoi routes
    router.get('/v1/cauhoi', asyncHandler(CauHoiController.getCauHoi));
    router.get('/v1/cauhoi/:id', asyncHandler(CauHoiController.getCauHoiById));
    router.get('/v1/cauhoi/de/:ma_de', asyncHandler(CauHoiController.getCauHoiByDeId));
    router.post('/v1/cauhoi', asyncHandler(CauHoiController.postCauHoi));
    router.put('/v1/cauhoi/:id', asyncHandler(CauHoiController.putCauHoi));
    router.delete('/v1/cauhoi/:id', asyncHandler(CauHoiController.deleteCauHoi));

    // Lop routes
    router.get('/v1/lop', asyncHandler(LopController.getLop));
    router.get('/v1/lop/:id', asyncHandler(LopController.getLopById));
    router.post('/v1/lop', asyncHandler(LopController.postLop));
    router.put('/v1/lop/:id', asyncHandler(LopController.putLop));
    router.delete('/v1/lop/:id', asyncHandler(LopController.deleteLop));

    // BaoCaoND routes
    router.get('/v1/baocaond', asyncHandler(BaoCaoNDController.getBaoCaoND));
    router.get('/v1/baocaond/:id', asyncHandler(BaoCaoNDController.getBaoCaoNDById));
    router.post('/v1/baocaond', asyncHandler(BaoCaoNDController.postBaoCaoND));
    router.delete('/v1/baocaond/:id', asyncHandler(BaoCaoNDController.deleteBaoCaoND));

    // BaoCaoCH routes
    router.get('/v1/baocaoch', asyncHandler(BaoCaoCHController.getBaoCaoCH));
    router.get('/v1/baocaoch/:id', asyncHandler(BaoCaoCHController.getBaoCaoCHById));
    router.post('/v1/baocaoch', asyncHandler(BaoCaoCHController.postBaoCaoCH));
    router.delete('/v1/baocaoch/:id', asyncHandler(BaoCaoCHController.deleteBaoCaoCH));

    // BuoiHoc routes
    router.get('/v1/buoi-hoc', asyncHandler(BuoiHocController.getBuoiHoc));
    router.get('/v1/buoi-hoc/:id', asyncHandler(BuoiHocController.getBuoiHocById));
    router.get('/v1/buoi-hoc/lop/:ma_lop', asyncHandler(BuoiHocController.getBuoiHocByLopId));
    router.post('/v1/buoi-hoc', asyncHandler(BuoiHocController.postBuoiHoc));
    router.put('/v1/buoi-hoc/:id', asyncHandler(BuoiHocController.putBuoiHoc));
    router.delete('/v1/buoi-hoc/:id', asyncHandler(BuoiHocController.deleteBuoiHoc));

    // LuotLamBai routes
    router.get('/v1/luot-lam-bai', asyncHandler(LuotLamBaiController.getLuotLamBai));
    router.get('/v1/luot-lam-bai/:id', asyncHandler(LuotLamBaiController.getLuotLamBaiById));
    router.get('/v1/luot-lam-bai/de/:ma_de', asyncHandler(LuotLamBaiController.getLuotLamBaiByDeId));
    router.post('/v1/luot-lam-bai', asyncHandler(LuotLamBaiController.postLuotLamBai));
    router.put('/v1/luot-lam-bai/:id', asyncHandler(LuotLamBaiController.putLuotLamBai));
    router.delete('/v1/luot-lam-bai/:id', asyncHandler(LuotLamBaiController.deleteLuotLamBai));

    // CauTraLoi routes
    router.get('/v1/cau-tra-loi/:id', asyncHandler(CauTraLoiController.getCauTraLoiById));
    router.get('/v1/cau-tra-loi/luot-lam-bai/:ma_lam_bai', asyncHandler(CauTraLoiController.getCauTraLoiByLuotLamBai));
    router.post('/v1/cau-tra-loi', asyncHandler(CauTraLoiController.postCauTraLoi));
    router.put('/v1/cau-tra-loi/:id', asyncHandler(CauTraLoiController.putCauTraLoi));
    router.delete('/v1/cau-tra-loi/:id', asyncHandler(CauTraLoiController.deleteCauTraLoi));

    // Loi routes
    router.get('/v1/loi', asyncHandler(LoiController.getLoi));
    router.get('/v1/loi/luot-lam-bai/:ma_lam_bai', asyncHandler(LoiController.getLoiByLuotLamBai));
    router.post('/v1/loi', asyncHandler(LoiController.postLoi));
    router.delete('/v1/loi/:id', asyncHandler(LoiController.deleteLoi));

    // MucHocTap routes
    router.get('/v1/muc-hoc-tap', asyncHandler(MucHocTapController.getMucHocTap));
    router.get('/v1/muc-hoc-tap/:id', asyncHandler(MucHocTapController.getMucHocTapById));
    router.get('/v1/muc-hoc-tap/buoi-hoc/:ma_buoi_hoc', asyncHandler(MucHocTapController.getMucHocTapByBuoiHoc));
    router.post('/v1/muc-hoc-tap', asyncHandler(MucHocTapController.postMucHocTap));
    router.put('/v1/muc-hoc-tap/:id', asyncHandler(MucHocTapController.putMucHocTap));
    router.delete('/v1/muc-hoc-tap/:id', asyncHandler(MucHocTapController.deleteMucHocTap));

    // Code routes
    router.get('/v1/code', asyncHandler(CodeController.getAllCode));
    router.get('/v1/code/:code', asyncHandler(CodeController.getCodeByCode));
    router.post('/v1/code', 
        validate(PostCodeRequest), 
        asyncHandler(CodeController.postCode));
    router.put('/v1/code/:code', asyncHandler(CodeController.putCode));

    // MenhDe routes
    router.get('/v1/menh-de/cau-hoi/:id', asyncHandler(MenhDeController.getMenhDeByCauHoiId));
    router.get('/v1/menh-de/:id', asyncHandler(MenhDeController.getMenhDeById));
    router.post('/v1/menh-de', asyncHandler(MenhDeController.postMenhDe));
    router.put('/v1/menh-de/:id', asyncHandler(MenhDeController.putMenhDe));
    router.delete('/v1/menh-de/:id', asyncHandler(MenhDeController.deleteMenhDe));

    app.use('/api/', router);
};
