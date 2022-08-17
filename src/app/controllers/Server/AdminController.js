const { multipleMongooseToObject } = require('../../../util/mongoose');
const Contact = require('../../models/contact');
class AdminController {

    // [GET] /admin/content-analysis
    contentAnalysis(req, res, next) {
        res.render('admin/content-analysis')
    }
    //[GET] /admin/quan-li-lien-he
    contact(req, res, next) {
        Contact.find({}).sort({main: 1})
            .then(contact => res.render('admin/contact', {
                contact: multipleMongooseToObject(contact),
                title: 'Quản lí thông tin liên hệ'
            }))
            .catch(next)
    }
    //[POST] /admin/them-thong-tin-lien-he
    addContactPOST(req, res, next) {
        let main = false;
        if(req.body.main === 'on') {
            main = true
        }
        const contact = new Contact({
            nameStore: req.body.nameStore,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            status: req.body.status,
            main: main
        })
        contact.save()
            .then(() => res.redirect('back'))
            .catch(next)
    }
    //[GET] /admin/contact-add
    addContactGET(req, res, next) {
        res.render('admin/add-contact')
    }
    //[DELETED] /manager/admin/deleted-books/:id
    deletedContact(req, res, next) {
        Contact.deleteOne({ _id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
    }
    //[POST] /manager/admin/:id/update-contact
    updateContact(req, res, next) {
        Contact.updateOne({_id: req.params.id}, req.body)
            .then(() => res.redirect('back'))
            .catch(next) 
    }
    messageBox(req, res, next) {
        res.render('./admin/messagebox');
    }
}
module.exports = new AdminController;