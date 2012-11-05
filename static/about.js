
$(#aboutWebitap).load(function(){

	/***********/
	//ABOUT WEBITAP SCRIPTS

		$("#screen #validPic img").fadeOut(0);

		$("#screen #load").fadeOut(0);

		$("#signal img").fadeOut(0);

		$("#tapPic img").fadeOut(0).eq(0).fadeIn(0);

		$("#screen #validPic img").eq(0).fadeIn(0);

		//$("#signal img").eq(0).fadeIn(0);

		setTimeout(function(){

			$("#screen #validPic img").eq(0).fadeOut(0);

			//$("#signal img").eq(0).fadeOut(0);

			

		},5500);



		var i = 0;

		setInterval(function(){

		if($("#tapPic img").length > (i+1)){

			//$("#signal img").eq(i).show();

			$("#signal img").eq(i).fadeIn(200,function(){

				$("#signal img").eq(i).fadeOut(200,function(){

					$("#signal img").eq(i).fadeIn(200,function(){

						$("#signal img").eq(i).fadeOut(200,function(){

			});

			});

			});

			});

			setTimeout(function(){

				$("#screen #validPic img").hide();

				$("#screen #load").show();

				//$("#signal img").hide();

				setTimeout(function(){

					$("#screen #load").hide();

						$("#screen #validPic img").eq(i).show();

						setTimeout(function(){

							//$("#screen #validPic img").hide();

							$("#screen #load").hide();

							

							$("#tapPic img").hide();

							$("#tapPic img").eq(i+1).fadeIn(1000);

							i++;

							},1000);

					

				},1600);

				

			},800);

				

				

			

		}else{

				//$("#signal img").eq(i).show();

				$("#signal img").eq(i).fadeIn(200,function(){

				$("#signal img").eq(i).fadeOut(200,function(){

					$("#signal img").eq(i).fadeIn(200,function(){

						$("#signal img").eq(i).fadeOut(200,function(){

			});

			});

			});

			});

			setTimeout(function(){

				$("#screen #validPic img").hide();

				$("#screen #load").show();

				//$("#signal img").hide();

				setTimeout(function(){

					$("#screen #load").hide();

						$("#screen #validPic img").eq(i).show();

						setTimeout(function(){

							//$("#screen #validPic img").hide();

							$("#screen #load").hide();

							

							$("#tapPic img").hide();

							$("#tapPic img").eq(0).fadeIn(1500);

							i=0;

							},1000);

					

				},1600);

				

			},800);

		}

		},5000)

		//ABOUT WEBITAP SCRIPTS
	
})

