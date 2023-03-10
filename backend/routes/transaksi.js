// //import library
// const express = require ("express")
// const app = express()
// app.use(express.json())

// //import model
// const models = require("../models/index")
// const transaksi = models.transaksi
// const detail_transaksi = models.detail_transaksi

// //import sequelize op
// const Sequelize = require("sequelize")
// const Op = Sequelize.Op

// //JIKA BELUM LUNAS TANGGAL BAYAR TETEP NULL/LANGSUNG TERISI NULL
// app.get("/", async (req, res) =>{
//     let result = await transaksi.findAll({
//         include: [
//             "user",
//             "meja",
//             {
//                 model: models.detail_transaksi,
//                 as : "detail_transaksi",
//                 include: ["menu"]
//             }
//         ],
//         order: [['createdAt', 'DESC']]
//     })
//     res.json({
//         count: result.length,
//         transaksi: result
//     })
// })

// app.get("/:id", (req, res) => {
//     let param = ({id_transaksi: req.params.id})
//     transaksi.findOne({where:param})
//     .then(result => {
//         res.json({
//             data: result
//         })
//     })

//     .catch(err => {
//         res.json({
//             msg: err.massage
//         })
//     })
// })

// app.get ("/id/:id_transaksi", async (req,res) => {
//     let param = { id_transaksi: req.params.id_transaksi}
//     let result = await transaksi.findAll({
//         where: param,
//         include: [
//             "user",
//             "meja",
//             {
//                 model: models.detail_transaksi,
//                 as : "detail_transaksi",
//                 include: ["menu"]
//             }
//         ]

//     })
//     let sumTotal = await transaksi.sum("total", {
//         where: param
//     })
//     res.json({
//         transaksibyid_transaksi: result,
//         sumTotal: sumTotal
//     })
// })
// // !----------------------------------------------------------------------------------------------------
// // get transaksi by user id 
// app.get ("/byUser/:id_user", async (req,res) => {
//     let param = { id_user: req.params.id_user}
//     let result = await transaksi.findAll({
//         where: param,
//         include: [
//             "user",
//             "meja",
//             {
//                 model: models.detail_transaksi,
//                 as : "detail_transaksi",
//                 include: ["menu"]
//             }
//         ],
//         order: [['createdAt', 'DESC']]

//     })
//      let sumTotal = await transaksi.sum("total", {
//          where: param
//      })
//     res.json({
//         count: result.length,
//         transaksibyid_user: result,
//         sumTotal: sumTotal
//     })
// })

// // !----------------------------------------------------------------------------------------------------

// app.post("/", async (req,res) => {
//     let current = new Date().toISOString().split('T')[0]
//     let data = {
//         tgl_transaksi: current,//current : 
//         id_user: req.body.id_user,//siapa customer yang beli
//         id_meja: req.body.id_meja,
//         nama_pelanggan: req.body.nama_pelanggan,
//         status: req.body.status,
//         total: req.body.total,
//     }
//     transaksi.create(data)
//     .then(result => {
//         let lastID = result.id_transaksi
//         console.log(lastID)
//         detail = req.body.detail_transaksi
//         detail.forEach(element => {//perungalan barang yang ada pada detail disimpan dalam element
//             element.id_transaksi = lastID
//         });
//         console.log(detail);
//         detail_transaksi.bulkCreate(detail)//bulkCreate create data lebih dari satu kali
//         .then(result => {
//             res.json({
//                 message: "Data has been inserted"
//             })
//         })
//         .catch(error => {
//             res.json({
//                 message: error.message
//             })
//         })
//     })
//     .catch(error => {
//         console.log(error.message);
//     })
// })


// app.post("/update/:id", (req, res) =>{
//     let param = { id_transaksi: req.params.id}
//     let data = {
//         status: req.body.status  
//     }
//     transaksi.update(data, {where: param})
//     .then(result => {
//         res.json({
//             message: "Data has been Updated"
//         })
//     })
//     .catch( error => {
//         res.json({
//             message: error.message
//         })
//     })
// })

// // app.post("/updateTotal/:id", (req, res) =>{
// //     let param = { id_transaksi: req.params.id}
// //     let data = {
// //         total: req.body.total,
// //         include: [
// //             "detail_transaksi"
// //         ]
// //     }
// //     transaksi.update(data, {where: param})
// //     .then(result => {
// //         res.json({
// //             message: "Data has been Updated"
// //         })
// //     })
// //     .catch( error => {
// //         res.json({
// //             message: error.message
// //         })
// //     })
// // })

// // app.post("/updateDetail", async (req, res) =>{
// //     // let param = { id: req.params.id}

// //     let detail = {
// //         id_transaksi: req.body.id_transaksi,
// //         id_menu: req.body.id_menu,
// //         price: req.body.price,
// //         qty: req.body.qty,
// //         subtotal: req.body.subtotal
// //     }
// //     detail_transaksi.create(detail)
// //     .then(result => {
// //         let lastID = detail.id_transaksi
// //         console.log(lastID)
// //         let data = {
// //             total: req.body.subtotal
// //         }
// //         transaksi.update(data,
// //            {where:{id_transaksi: lastID }})
// //     // transaksi.update(data, {where: param})
// //     .then(result => {
// //         res.json({
// //             message: "Data has been inserted"
// //         })
// //     })
// //     })
// //     .catch(error => {
// //         res.json({
// //             message: error.message
// //         })
// //     })

// // })
const express = require("express");
const app = express()
const Sequelize = require("sequelize");
const Op = Sequelize.Op
const { auth, isAdmin, isKasir, isManajer } = require("../auth")

const models = require("../models");
const transaksi = models.transaksi;
const detail_transaksi = models.detail_transaksi;
const user = models.user;

app.use(express.json());

app.get("/", auth, isManajer, async (req, res) => {
    let result = await transaksi.findAll({
        include: [
            "user",
            "meja",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["menu"]
            }
        ],
        order: [['createdAt', 'DESC']]
    })
    res.json({
        count: result.length,
        transaksi: result
    })
})

app.get("/:id", async (req, res) => {
    const param = { id_transaksi: req.params.id };
    try {
        const result = await transaksi.findOne({ where: param });
        res.json({ data: result });
    } catch (err) {
        res.json({ msg: err.message });
    }
});

app.get("/id/:id_transaksi", auth, isKasir, async (req, res) => {
    const param = { id_transaksi: req.params.id_transaksi };
    try {
        const result = await transaksi.findAll({
            where: param,
            include: ["user", "meja", { model: detail_transaksi, as: "detail_transaksi", include: ["menu"] }],
        });
        const sumTotal = await transaksi.sum("total", { where: param });
        res.json({ transaksibyid_transaksi: result, sumTotal: sumTotal });
    } catch (err) {
        res.json({ msg: err.message });
    }
});

app.get("/byUser/:nama_user", auth, isManajer, async (req, res) => {
    const param = { nama_user: req.params.nama_user };
    try {
        const result = await transaksi.findAll({
            where: param,
            include: ["user", "meja", { model: detail_transaksi, as: "detail_transaksi", include: ["menu"] }],
            order: [["createdAt", "DESC"]],
        });
        const sumTotal = await transaksi.sum("total", { where: param });
        res.json({ count: result.length, transaksibyid_user: result, sumTotal: sumTotal });
    } catch (err) {
        res.json({ msg: err.message });
    }
});

app.post("/add", auth, isKasir, async (req, res) => {
    const current = new Date().toISOString().split("T")[0];
    const data = {
        tgl_transaksi: current,
        id_user: req.body.id_user,
        id_meja: req.body.id_meja,
        nama_pelanggan: req.body.nama_pelanggan,
        status: "belum_bayar",
        total: req.body.total
    };
    try {
        const result = await transaksi.create(data);
        const lastID = result.id_transaksi;
        const detail = req.body.detail_transaksi.map((item) => ({ ...item, id_transaksi: lastID }));
        await detail_transaksi.bulkCreate(detail);
        res.json({ message: "Data has been inserted" });
    } catch (err) {
        console.log(err.message);
        res.json({ message: err.message });
    }
});

// //tambah transaksi 2
// app.post("/tambah", async (req, res) => {
//     let current = new Date().toISOString().split('T')[0]
//     let data = {
//         tgl_transaksi: current,//current : 
//         id_user: req.body.id_user,//siapa customer yang beli
//         id_meja: req.body.id_meja,
//         nama_pelanggan: req.body.nama_pelanggan,
//         status: "belum_bayar",
//         total: 0 // inisialisasi nilai total awal
//     }
//     let param = { id_meja: req.body.id_meja }

//     // Periksa apakah meja tersedia atau tidak
//     let mejaData = await meja.findOne({
//         where: { id_meja: req.body.id_meja, available: 
// "yes" },
//     });
//     if (!mejaData) {
//         return res.json({
//             message: "Meja tidak tersedia",
//         });
//     }

//     // Periksa apakah meja masih digunakan atau tidak
//     let transaksiData = await transaksi.findOne({
//         where: { id_meja: req.body.id_meja, status: "belum_bayar" },
//     });
//     if (transaksiData) {
//         return res.json({
//             message: "Meja masih digunakan",
//         });
//     }

//     let upMeja = {
//         available: "no"
//     }
//     await meja.update(upMeja, ({ where: param }))
//     transaksi.create(data)
//         .then(result => {
//             let lastID = result.id_transaksi
//             console.log(lastID)
//             detail = req.body.detail_transaksi

// let total = 0 
// detail.forEach(element => {
//     element.id_transaksi = lastID
//     element.subtotal = element.qty * element.price 
//     total += element.subtotal 
// });
// console.log(detail);
// detail_transaksi.bulkCreate(detail)
//     .then(result => {
//         transaksi.update({ total: total }, { where: { id_transaksi: lastID } })
//             .then(result => {
//                 res.json({
//                     message: "Data has been inserted"
//                 })
//             })
//             .catch(error => {
//                 res.json({
//                     message: error.message
//                 })
//             })
//     })
//     .catch(error => {
//         res.json({
//             message: error.message
//         })
//     })
// })
// .catch(error => {
// console.log(error.message);
// ????????????????})
// })

app.put("/update/:id", auth, isKasir, async (req, res) => {
    const param = { id_transaksi: req.params.id };
    const data = { status: req.body.status };
    try {
        await transaksi.update(data, { where: param });
        res.json({ message: "Data has been updated" });
    } catch (err) {
        res.json({ message: err.message });
    }
});

app.delete("/delete/:id_transaksi", async (req, res) => {
    let param = { id_transaksi: req.params.id_transaksi }
    try {
        await detail_transaksi.destroy({ where: param })//menghapus detail dulu atau anak 
        await transaksi.destroy({ where: param })//baru selanjutnya hapus yang parent kalau insert sebaliknya
        res.json({
            message: "data has been deleted"
        })
    } catch (error) {
        res.json({
            message: error
        })


    }
})

// Search transaksi by nama user
app.get("/search/:keyword", auth, isManajer, async (req, res) => {
    let keyword = req.params.keyword
    let result = await transaksi.findAll({
        where: {
            // id_user: req.params.id_user,
            [Op.or]: [
                {
                    id_transaksi: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    total: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nama_pelanggan: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    '$user.nama_user$': {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        },
        include: [
            "user",
            "meja",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["menu"]
            }
        ],
        order: [['id_transaksi', 'DESC']]
    })
    let sumTotal = await transaksi.sum("total", {
        where: {
            // id_user: req.params.id_user,
            [Op.or]: [
                {
                    id_transaksi: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    total: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nama_pelanggan: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    '$user.nama_user$': {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        },
        include: [
            "user",
            // "meja",
            // {
            //     model: models.detail_transaksi,
            //     as: "detail_transaksi",
            //     include: ["menu"]
            // }
        ],
        order: [['id_transaksi', 'DESC']]
    });
    res.json({
        count: result.length,
        transaksi: result,
        sumTotal: sumTotal
    })
})

// app.get("/search/date",auth, isManajer, async (req, res) => {
//     let start = new Date(req.body.start)
//     let end = new Date(req.body.end)

//     let result = await transaksi.findAll({
//         where: {
//             // id_user: req.params.id_user,
//             // total: "lunas",

//             tgl_transaksi: {
//                 [Op.between]: [
//                     start, end
//                 ]
//             }
//         },
//         include: [
//             "user",
//             "meja",
//             {
//                 model: models.detail_transaksi,
//                 as: "detail_transaksi",
//                 include: ["menu"]
//             }
//         ],
//         order: [['createdAt', 'DESC']],

//     })
//     let sumTotal = await transaksi.sum("total", {
//         where: {
//             // id_user: req.params.id_user,
//             tgl_transaksi: {
//                 [Op.between]: [
//                     start, end
//                 ]
//             }
//         }
//     });
//     res.json({
//         count: result.length,
//         transaksi: result,
//         sumTotal: sumTotal
//     })
// })

//get data transaksi by date
app.post("/date",auth, isManajer, async (req, res) => {
    let start = new Date(req.body.start)
    let end = new Date(req.body.end)

    let result = await transaksi.findAll({
        where: {
            // id_user: req.params.id_user,
            // total: "lunas",

            tgl_transaksi: {
                [Op.between]: [
                    start, end
                ]
            }
        },
        include: [
            "user",
            "meja",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["menu"]
            }
        ],
        order: [['createdAt', 'DESC']],

    })
    let sumTotal = await transaksi.sum("total", {
        where: {
            // id_user: req.params.id_user,
            tgl_transaksi: {
                [Op.between]: [
                    start, end
                ]
            }
        }
    });
    res.json({
        count: result.length,
        transaksi: result,
        sumTotal: sumTotal
    })
})


module.exports = app;