import db from '../utils/db.js'
export default{
    async findAll(){
        return await db.select().table('sentences');
    },
    async updateVote(vote, id){
        return await db('sentences').update({vote: vote}).where({id: id})
    },
}