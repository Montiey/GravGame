function* everyN(num){
	var curr = 0;
	while(1){
		curr++;
		if(curr == num){
			curr = 0;
			yield 1;
		}
		else yield 0;
	}
}
