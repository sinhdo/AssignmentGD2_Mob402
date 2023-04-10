const express = require('express')
const mongoose = require('mongoose')
const uri = 'mongodb+srv://sinhdtph27866:5lITuoqDF51tCSNE@cluster0.8dci3g9.mongodb.net/assignment?retryWrites=true&w=majority';
const expressHbs = require('express-handlebars')
const UserModel = require('./UserModel')
const ProductModel = require('./ProductModel');
const mongodb = require('mongodb')
const querystring = require('querystring');
const app = express()
const check = (item) => {
    if (item == 1) {
        return "Admin";
    }
    return "User";
}
app.engine('.hbs', expressHbs.engine({
    extname: "hbs",
    defaultLayout: 'main',
    layoutsDir: "views/layouts/"
}))
app.set('view engine', '.hbs')
app.get('/', (req, res) => {
    try {
        res.render('pagedangnhap')
    } catch (error) {
        console.log(error);
    }
})
app.get('/trangchu1', async (req, res) => {
    await mongoose.connect(uri)
    const listUser = await UserModel.find().lean()
    let email = req.query.emaillg;
    let pass = req.query.passlg;
    const listProducts = await ProductModel.find().lean();
    listUser.forEach(value => {
        if (email === value.email && pass === value.matkhau && value.quyen == "Admin") {
            console.log(value.email + value.matkhau);
            try {

                res.render('pageTrangChu', { dataUser: listUser, showUser: true, myEmail: value.hoten, myQuyen: value.quyen })
            } catch (error) {
                console.log(error);
            }
        } else if (email === value.email && pass === value.matkhau && value.quyen === "User") {
            res.render('pageProducts', { dataProduct: listProducts, showUser: false, myEmail: value.hoten, myQuyen: value.quyen,dataUser:listUser });
        }
    });
})
app.get('/trangchu', async (req, res) => {
    try {
        await mongoose.connect(uri);
        const listUser = await UserModel.find().lean();
        res.render('pageTrangChu', { dataUser: listUser, showUser: true, })
    } catch (error) {
        console.log(error);
    }
})
app.get('/products', async (req, res) => {
    await mongoose.connect(uri);
    const listUser = await UserModel.find().lean();
    const listProducts = await ProductModel.find().lean();


    try {
        res.render('pageProducts', { dataProduct: listProducts, showUser: true,dataUser:listUser });
    } catch (error) {
        console.log(error);
    }



})
app.get('/xndk', async (req, res) => {
    let fullname = req.query.fullnameUS;
    let email = req.query.emailUS;
    let pass = req.query.passUS;
    let user = new UserModel({
        email: email,
        matkhau: pass,
        hoten: fullname,
        quyen: "User"
    })
    console.log(fullname);
    try {
        await user.save()
        res.redirect('dangnhap')
    } catch (error) {
        console.log(error);
    }
})
app.get('/add-products', async (req, res) => {
    let img = req.query.imgPR;
    let id = req.query.idPR;
    let name = req.query.namePR;
    let price = parseInt(req.query.pricePR);
    let color = req.query.colorPR;
    let saler = req.query.salerPR;
   
    let product = new ProductModel({
        masp: id,
        anh: img,
        tensp: name,
        dongia: price,
        mausac: color,
        nguoiban: saler
    })
   
    try {
        await product.save()
        res.redirect('products' );
        // console.log(query);
    } catch (error) {
        console.log(error);
    }
})
app.get('/deleteUser', async (req, res) => {
    let idUser = req.query.idUser
    try {
        UserModel.collection.deleteOne({ _id: new mongodb.ObjectId(`${idUser}`) })
        res.redirect('/trangchu')
    } catch (error) {

    }
    console.log(idUser);
})
app.get('/deleteProduct', async (req, res) => {
    let idProduct = req.query.idProduct
    try {
        ProductModel.collection.deleteOne({ _id: new mongodb.ObjectId(`${idProduct}`) })
        res.redirect('/products')
    } catch (error) {
        console.log(error);
    }
})
app.get('/upUser', async (req, res) => {
    let idUp = req.query.idEdit
    console.log(idUp);
    try {
        const listUser = await UserModel.find().lean()
        let userUp = await UserModel.find({ _id: new mongodb.ObjectId(`${idUp}`) }).lean()
        res.render('pageUpdate', { dataUser: listUser, user: userUp[0], index: idUp })
    } catch (error) {
        console.log(error);
    }
});
app.get('/upUser/update', async (req, res) => {
    let fullname = req.query.fullnameUS
    let email = req.query.emailUS
    let pass = req.query.passUS
    let idUser = req.query.idUser
    let power = req.query.powerUS;
    try {
        await mongoose.connect(uri)
        await UserModel.collection.updateOne({ _id: new mongodb.ObjectId(`${idUser}`) }, { $set: { hoten: fullname, email: email, matkhau: pass, quyen: check(power) } });
        res.redirect('/trangchu')
        // console.log(fullname);
    } catch (error) {
        console.log(error);
    }
})
app.get('/updatePR', async (req, res) => {
    let img = req.query.imgPR;
    let id = req.query.idPR;
    let name = String.value(req.query.namePR);
    let price = parseInt(req.query.pricePR);
    let color = req.query.colorPR
    let idPR = req.query.idupPR
    let salerPR = req.query.salerPR
    try {
        await mongoose.connect(uri)
        await ProductModel.collection.updateOne({ _id: new mongodb.ObjectId(`${idPR}`) }, { $set: { anh: img, masp: id, tensp: name, dongia: price, mausac: color,nguoiban:salerPR } })
        res.redirect('/products')
        // console.log(name + price);

    } catch (error) {
        console.log(error);
    }
})
// app.get('/dangky', (req, res) => {
//     try {
//         res.render('pagedangky')
//     } catch (error) {
//         console.log(error);
//     }
// })
app.get('/dangnhap', async (req, res) => {
    try {
        res.render('pagedangnhap');
    } catch (error) {
        console.log(error);
    }
})
app.get('/filter', async (req, res) => {
    let sName = req.query.username
    let sEmail = req.query.email
    let arr = []
    let stringNull = false;
    try {
        let myData = await UserModel.find().lean()
        for (let i = 0; i < myData.length; i++) {
            if (myData[i].name==sName|| myData[i].email.search(sEmail) !== -1) {
                arr.push(myData[i])
            }
        }
        if (arr.length != 0) {
            stringNull = true
        }
        // console.log(arr);
        res.render('pagetrangchu', { dataUser: arr })
    } catch (error) {
        console.log(error);
    }
})
app.get('/filter1', async (req, res) => {
    let sid = req.query.idsp
    let arr = []
    let stringNull = false;
    try {
        let myData = await ProductModel.find().lean()
        for (let i = 0; i < myData.length; i++) {
            if (myData[i].masp==sid) {
                arr.push(myData[i])
            }
        }
        if (arr.length != 0) {
            stringNull = true
        }
        // console.log(arr);
        res.render('pageProducts', { dataProduct: arr })
    } catch (error) {
        console.log(error);
    }
})




app.listen(3000, (req, res) => {
    console.log("Chay localhot 3000");
})