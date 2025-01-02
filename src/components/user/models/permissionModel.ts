const mongoose_ = require("mongoose");


const permissionSchema = new mongoose_.Schema({
    name: {
        type: String,
    },
    status: {
      type: Boolean,
      required: false,
      default: 1,
      comment: '0 is Deactive 1 is Active'
   },
}, { timestamps: true });



module.exports = mongoose_.model('Permission', permissionSchema);