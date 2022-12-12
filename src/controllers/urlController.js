const urlModel = require('../models/urlModel');
const isUrlValid = require("url-validation");
const{isValidRequestBody,isValid}=require('../validations/validation')
const axios = require('axios')
const shortid = require("shortid");
const baseUrl = 'http://localhost:3000'



//------------------------first api to generate url code-------------------------------------------------
const generateUrl = async function (req, res) {
    try {
  
    //destructuring
    const { longUrl } = req.body

    if (!isValidRequestBody(req.body)) {
        return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide long url' })
    }

    if (!isValid(longUrl)) {
        res.status(400).send({ status: false, message: `longUrl is required` })
        return
    }


    //check long url is valid or not-http is present or not
    if (!isUrlValid(longUrl.trim().split(' ').join(''))) {
        return res.status(400).send({ status: false, message: "longUrl is not valid, Please provide valid url" })

    }

    let option = {
        method: 'get',
        url: longUrl
    }
    let urlValidate = await axios(option)
        .then(() => longUrl)   
        .catch(() => null)    

    if (!urlValidate) { 
        return res.status(400).send({ status: false, message: `This Link: ${longUrl} is not Valid URL.` }) 
    }

    console.log(urlValidate)
   
        let myUrl = longUrl.trim().split(' ').join('')
        let url = await urlModel.findOne({ longUrl: myUrl }).select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0 })
        if (url) {
            res.status(200).send({ status: true, data: url })
        }
        else {
            const urlCode = shortid.generate()
            const shortUrl = baseUrl + '/' + urlCode
            let shortUrlInLowerCase = shortUrl.toLowerCase()

            

            url = {
                longUrl: longUrl.trim().split(' ').join(''),
                shortUrl: shortUrlInLowerCase,
                urlCode: urlCode,
            }

            const myShortUrl = await urlModel.create(url)
            res.status(201).send({ status: true, data: myShortUrl })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })

    }
}

//--------------------------GetApi-----------------------

const redirectToLongUrl = async function (req, res) {
    try {
        const urlCode = req.params.urlCode
      
            const findUrl = await urlModel.findOne({ urlCode: urlCode })
            if (!findUrl) {
                
                return res.status(302).send({ status: false, msg: "No URL Found" })         
        }else{
            return res.status(200).send({status:true,message:"succesfully fetch Url",data:findUrl})
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports={generateUrl,redirectToLongUrl}
