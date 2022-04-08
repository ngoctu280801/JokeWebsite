import express from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import hbs_sections from 'express-handlebars-sections';
import contentModel from './models/content.model.js'
import cookiesParser from 'cookie-parser'
const app = express();
const port = 3000;
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(morgan('dev'));
app.use(cookiesParser());
app.use(express.urlencoded({
    extended:true
}));
app.engine('hbs', engine({
    defaultLayout: 'main.hbs',
    helpers:{
        section: hbs_sections()
    }
}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
app.set('views', './views');
app.get('/',async function (req, res){
    const cookies = req.cookies; //lay cookie
    const list = await contentModel.findAll();
    let content = null;
    if(cookies.numJoke === undefined){
        res.cookie('numJoke',1,{
            httpOnly:true,
            secure:true
        })
        content = list[0];
        res.render('home',{
            layout: 'main.hbs',
            content
        });
    }
    else{
        if(+cookies.numJoke > list.length ){
            res.render('message',{
                layout:'main.hbs'
            });
        }
        else{
            let num = +cookies.numJoke;
            content = list[num-1];
            console.log(content);
            res.cookie('numJoke',num,{
                httpOnly:true,
                secure:true
            })
            res.render('home',{
                layout: 'main.hbs',
                content
            });
        }
    }
})
app.post('/', async function (req,res){
    const cookies = req.cookies; //lay cookie
    const list = await contentModel.findAll();
    const result = req.body;
    const current_id  = +cookies.numJoke;
    contentModel.updateVote(+result.vote,+current_id);// luu vote vao db
    var next_id = 1 + +current_id;
    if(+next_id > list.length){
        res.cookie('numJoke',next_id,{
            httpOnly:true,
            secure:true
        })
        res.render('message',{
            layout:'main.hbs'
        });
    }
    else{
        const content = list[next_id - 1];
        res.cookie('numJoke',next_id,{
            httpOnly:true,
            secure:true
        })
        res.render('home',{
            layout: 'main.hbs',
            content
        });
    }
})
app.listen(port,function(){
    console.log(`Listening at http://localhost:${port}`);
})