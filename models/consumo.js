exports = module.exports=function(app,mongoose)
{
	var Schema = mongoose.Schema;
	var userSchema = new Schema({
		Consumo:{type:String, required:true},
		Precio:{type:String, required:true},
		FechaFin:{type:Date,required:true},
		Ano:{type:Number,required:true}
		});
	mongoose.model('Consumo',userSchema);
};