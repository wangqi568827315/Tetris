var Coordinate=("0,1,1,1,2,1,3,1;1,1,2,1,1,2,2,2;1,0,1,1,1,2,2,2;1,0,1,1,2,1,2,2;1,1,0,2,1,2,2,2;2,0,1,1,2,1,1,2;2,0,2,1,1,2,2,2").split(";");
var unit=20;
var main,activeShape;
var timeId = null;
var judge = 1;
function MainFrame(w,h)
{
	//横向单位
	this.x = w ? w : 10;
	//纵向单位
	this.y = h? h : 20;
	//记录所有单元格的情况
	this.unitDivs=[];
	
	//记录活动的图形
	this.myshape;
	//分数
	this.score=0;
	this.scoreDiv;
	
	this.gameoverDiv;
	this.tipDiv;
	
	this.mylevel=1;
	//速度
	this.speed = 800;
	//图形移动结束标志
	this.over = false;
	//指向自己的引用
	this.frame;
	//this.mainframe = this;
	
	
	//初始化
	this.init = function(){
		
		this.Createscore();
		this.CreateGameover();
		this.CreateTip();
		this.frame = document.createElement("div");
		this.frame.className = "main";
		this.frame.style.width = (this.x*unit)+"px";
		this.frame.style.height = (this.y*unit)+"px";
//		this.frame.style.left = "200px";
//		this.frame.style.top = "100px";
		document.body.appendChild(this.frame);
		
		
		
		
		for (var row=0;row<this.y;row++ ) {
			var arr =[];
			for(var col=0;col < this.x;col++)
			{
				arr.push(0);
			}
			this.unitDivs.push(arr);
		}
		//添加底部边界
		var arr1 =[];
		for(var i=0;i < this.x;i++)
		{
			arr1.push(1);
		}
		this.unitDivs.push(arr1);
		
	}
	//开始游戏
	this.startGame = function(){
		//创建图形
		this.myshape = new Shape(this,this.frame);
		this.myshape.show();
		
		//开启定时器下移图形
//		setTimeout("activeShape.vMove()",this.speed);

		return this.myshape;
	}
	//
	this.Createscore = function(){
		
		this.scoreDiv = document.createElement("div");
		this.scoreDiv.className="score";
		this.scoreDiv.style.width =(this.x*unit - 20)+"px";
		this.scoreDiv.id="score";
		this.scoreDiv.style.border = "1px solid gray";
		this.CreatescoreText(this.mylevel,this.score);
		document.body.appendChild(this.scoreDiv);
		
	}
	this.CreateGameover = function(){
		
		this.gameoverDiv = document.createElement("div");
		this.gameoverDiv.className="gameover";
		this.gameoverDiv.style.width =(this.x*unit)+"px";
		this.gameoverDiv.innerHTML = "<span><i><b>Game Over !</b><i></span><br/>";
		this.gameoverDiv.innerHTML+="<input type='button' value='Replay' style='border:1px solid orangered;width:50px;height:20px' onclick='window.location.reload();'/>"
		this.gameoverDiv.style.top =(this.y*unit/2.5)+"px";
		this.gameoverDiv.id="gameover";
		document.body.appendChild(this.gameoverDiv);
		
	}

	this.CreateTip = function(){
		
		this.tipDiv = document.createElement("div");
		this.tipDiv.className="intro";
		this.tipDiv.style.width =(this.x*unit)+"px";
		this.tipDiv.style.height =(this.y*unit + 92)+"px";
		this.tipDiv.style.left = (this.x*unit + 200) + "px";
		this.tipDiv.style.border = "1px solid gray";
		this.tipDiv.id="intro";
		this.tipDiv.innerHTML = "<p>· ↑：变形</p><p>·←：左移</p><p>·→：右移</p><p>· ↓：下移</p><p>·按空格键暂停游戏</p><p>·一次消除一行得100分</p>"
		+"<p>·一次消除两行得300分</p><p>·一次消除三行得600分</p><p>·一次消除四行得1000分</p>"
		+"<p>·达到一定分数即可升级，方块下降速度也会加快</p><br/><p>祝您游戏愉快！</p>";
		
		document.body.appendChild(this.tipDiv);
		
	}
	
	this.CreatescoreText = function(l,s)
	{
		if(this.scoreDiv == undefined)
		{
			this.scoreDiv = document.getElementById("score");
			
		}
		this.scoreDiv.innerHTML ="Level :"+l+"<br>"+"Score:"+s;
	}

	//检查每一行的情况
	this.checkRow = function(){
		//定义数组保存不能消除的上面的小div
		var temp = [];
		var row=0;
		var samlldiv = this.frame.children;
		this.unitDivs.length
		for(var i =0;i<this.y;i++)
		{

			var small=[];
			//找出这一行的小div
			for(var k=0;k<this.frame.children.length;k++)
			{
				if(this.frame.children[k].style.top ==(i*unit)+"px")
				{
					small.push(this.frame.children[k]);
				}
			}
			//如果top偏移为0或20，GameOver
			if(i*unit <=20 && small.length>0)
			{
				//GameOver
				document.getElementById("gameover").style.display = "block";
				clearInterval(timeId);
				timeId = null;
				return;
			}
			
			
			var isClear = true;
			for(j=0;j<this.unitDivs[i].length;j++)
			{
				if(this.unitDivs[i][j] == 0)
				{
					isClear = false;
					break;
				}
			}
			
			for(var j=0;j<this.unitDivs[i].length;j++)
			{
				this.unitDivs[i][j]=0;
			}
			
			if(isClear) //要消除这一行
			{
				debugger;
				//重置为1的数据
				for(var o=0;o<this.unitDivs[i].length;o++)
				{
					this.unitDivs[i][o]=0;
				}

				for(var m=0;m<small.length;m++)
				{
					this.frame.removeChild(small[m]);
				}
				
				
				//把临时保存的小div向下移一行
				for(var n=0;n<temp.length;n++)
				{
					//通过div的偏移计算
					temp[n].style.top = (parseInt(temp[n].style.top)+20)+"px";
				}
				//var row变量累加
				row++;
			}
			else//把这一行的小div保存到临时数组 
			{
				temp = temp.concat(small);
			}
		}
		//计算unitDivs中为1的单元格
		for(i=0;i<temp.length;i++)
		{
			var x= parseInt(temp[i].style.left)/20;
			var y = parseInt(temp[i].style.top)/20;
			this.unitDivs[y][x] =1;
		}
		
		this.calculateScore(row);
	}
	
	//计算分数
	this.calculateScore = function(r){
		//通过消除的行去计算累加分数,判断是否过关，修改level和speed
		switch(r){
			case 1:this.score += 100;this.scoreDiv.innerHTML = this.score;
			break;
			case 2:this.score += 300;this.scoreDiv.innerHTML = this.score;
			break;
			case 3:this.score += 600;this.scoreDiv.innerHTML = this.score;
			break;
			case 4:this.score += 1000;this.scoreDiv.innerHTML = this.score;
			break;
		}
		if((this.score >= 1000)&&(this.score < 1500)){
			this.mylevel = 2;
			addSpeed(100);
		}
		if((this.score >= 1500)&&(this.score < 2200)){
			this.mylevel = 3;
			addSpeed(200);
		}
		if((this.score >= 2200)&&(this.score < 3200)){
			this.mylevel = 4;
			addSpeed(300);
		}
		if((this.score >= 3200)&&(this.score < 4500)){
			this.mylevel = 5;
			addSpeed(400);
		}
		if((this.score >= 4500)&&(this.score < 6000)){
			this.mylevel = 6;
			addSpeed(500);
		}
		if((this.score >= 6000)&&(this.score < 7800)){
			this.mylevel = 7;
			addSpeed(600);
		}
		if(this.score >= 7800){
			this.mylevel = 8;
			addSpeed(700);
		}
		
		this.CreatescoreText(this.mylevel,this.score);
	}
}


function Shape(mf,f)
{
	//主窗体
	this.mainframe = mf;
	this.myframe=f;
	//记录图形坐标
	this.coord; 
	//小图形数组
	this.divs=[];
	this.x=(this.mainframe.x -4)/2;
	this.y=0;
	
	//随机初始化图形
	this.init = function(){
		this.coord = Coordinate[Math.floor(Math.random()*Coordinate.length)].split(",");
		
		for(var i=0;i<4;i++)
		{
			var sdiv = document.createElement("div");
			sdiv.className = "active";
			if(this.mainframe !=undefined)
			{
				this.myframe.appendChild(sdiv);
			}
			this.divs.push(sdiv);
			
		}
	}
	
	//显示图形
	this.show = function(){
		
		var canMove= true;
		var point=[];
		var realx;
		
		//横向居中需偏移单位
		for(var i=0;i<this.divs.length;i++)
		{
			var small = this.divs[i];
			realx=(parseInt(this.coord[i*2])+this.x)*unit;
			if(this.hCheck(realx))
			{
				var arr=[realx,(parseInt(this.coord[i*2+1])+this.y)*unit];
				point.push(arr);
			}else
			{
				canMove = false;
			}
		}
		if(canMove)
		{
			for(var i=0;i<this.divs.length;i++)
			{
				this.divs[i].style.left =point[i][0] +"px";//横向偏移
				this.divs[i].style.top = point[i][1] +"px";//纵向偏移
			}
		}
		
	}
	//下移
	this.vMove = function(){
		
		var canMove = true;
		var point=[];
		this.y++;
		for(var i=0;i<this.divs.length;i++)
		{
			var small = this.divs[i];
			var top = small.style.top.replace("px","");
			
			if(this.vCheck(this.x+parseInt(this.coord[i*2]),this.y+parseInt(this.coord[i*2+1])))
			{
				point.push((parseInt(top)+unit));
			}else
			{
				canMove =false;
				break;
			}
		}
		if(canMove) //可以移动
		{
			for(var i=0;i<this.divs.length;i++)
			{
				this.divs[i].style.top = point[i] +"px";//纵向偏移
			}
//			setTimeout("activeShape.vMove()",this.mainframe.speed);
		}
		else
		{
			//变灰色
			for(var i=0;i<this.divs.length;i++)
			{
				this.divs[i].className="atrest";
				this.mainframe.unitDivs[this.y-1+parseInt(this.coord[i*2+1])][this.x+parseInt(this.coord[i*2])]=1;
			}
/*			console.log("变灰："+timeId);
			clearInterval(timeId);
			console.log("变灰后："+timeId);*/
//			timeId = null;
			//检查是否消除
			
			this.mainframe.checkRow();
			

			activeShape = this.mainframe.startGame();
					
			
			
		}
		
			//small.style.top = (parseInt(top)+unit) +"px";//纵向偏移
	}
	//水平移动
	this.hMove = function(h){
		
		var canMove= true;	
		var realLeft=0;
		var point=[];
		for(var i=0;i<this.divs.length;i++)
		{
			var small = this.divs[i];
			var left = small.style.left.replace("px","");
			//移动后实际的偏移
			if(h>0)
			{
				if(this.vCheck((this.x+1)+parseInt(this.coord[i*2]),this.y+parseInt(this.coord[i*2+1])))
				{
					realLeft =(parseInt(left)+unit);
				}else
				{
					canMove = false;
					break;
				}
				
			}else
			{
				if(this.vCheck((this.x-1)+parseInt(this.coord[i*2]),this.y+parseInt(this.coord[i*2+1])))
				{
					realLeft=(parseInt(left)-unit);//横向偏移
				}
				else
				{
					canMove = false;
					break;
				}
			}
			if(this.hCheck(realLeft))
			{
				point.push(realLeft);
			}else
			{
				canMove = false;
				break;
			}
		}
		
		if(canMove)
		{
			for(var i=0;i<this.divs.length;i++)
			{
				this.divs[i].style.left =point[i]+"px";//横向偏移
			}
			if(h>0)
			{
				this.x++;
			}else
			{
				this.x--;
			}
		}
	}
	//变化
	this.change = function(){
		
		var newCoord = [3-this.coord[1],this.coord[0]-0,3-this.coord[3],this.coord[2]-0,
		3-this.coord[5],this.coord[4]-0,3-this.coord[7],this.coord[6]-0];
		
		if(this.vCheck(this.x+newCoord[0],this.y+newCoord[1]) && 
		this.vCheck(this.x+newCoord[2],this.y+newCoord[3]) &&
		this.vCheck(this.x+newCoord[4],this.y+newCoord[5]) &&
		this.vCheck(this.x+newCoord[6],this.y+newCoord[7]))
		{
			this.coord = newCoord;
			this.show();
		}
	}
	
	//检查左右边界
	this.hCheck = function(d){
		//var leftpx =  parseInt(this.myframe.style.left);
		var rightpx =parseInt(this.myframe.style.width);// parseInt(this.myframe.style.left)+
		if(0 <=d && d< rightpx)
		{
			return true;
		}else
		{
			return false;
		}
	}
	
	this.vCheck = function(x,y){
		//确定向下的边界
		
		if(this.mainframe.unitDivs[y][x] ==1)
		{
			return false;
		}else
		{
			return true;
		}
		
		
	}
	
	
	this.init();
}


document.onkeydown = function()
{
	var keyCode = event.keyCode;
	
	//alert(keyCode);
	
	//38向上37左39右40向下
	if(judge == 1){
		switch(keyCode)
		{
		case 37:
			activeShape.hMove(-1);
			break;
		case 38:
			activeShape.change();
			break;
		case 39:
			activeShape.hMove(1);
			break;
		case 40:
			activeShape.vMove();
			break;
		}
	}
	pause();
}
function pause()
{
	var keyCode = event.keyCode;
	switch(keyCode)
	{
		case 32:
			console.log(timeId);
			if(timeId != null){
				clearInterval(timeId);
				timeId = null;
				judge = 0;
			}
			else {
				timeId=setInterval("activeShape.vMove()",main.speed);
				judge = 1;
		}
			break;
	}


	
}

window.onload= function(){
	main = new MainFrame(12,24);
			//初始化界面
	main.init();
	activeShape=main.startGame();
	
	console.log("kaishi前"+timeId);
	timeId=setInterval("activeShape.vMove()",main.speed);
	console.log("kaishi开始后"+timeId);
}

function addSpeed(i){
	clearInterval(timeId);
	timeId=setInterval("activeShape.vMove()",main.speed-i);
}
