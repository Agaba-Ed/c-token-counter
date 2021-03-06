//read input from file
var input=document.getElementById('input-file');
input.addEventListener('change', function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
    var code = e.target.result;
    var code_editor = document.getElementById('code');
     code_editor.value = code;
    };
    reader.readAsText(file);
});


    var operands=[];
    var operators=[];

    var HalsteadMetrics={
        operands:{

        },
        operators:{

        }
    }

    function programLength(){
   return HalsteadMetrics.N1+HalsteadMetrics.N2;

}

function programVocabulary(){
    return HalsteadMetrics.n1+HalsteadMetrics.n2;

}

function programVolume(){
    return programLength()*Math.log2(programVocabulary());
}

function programDifficulty(){
    return (HalsteadMetrics.n1/2)*(HalsteadMetrics.N2/HalsteadMetrics.n2);
}

function programLevel(){
    return 1/programDifficulty();
}

function programMinimumVolume(){
    return programLevel()*programVolume();
}

function programEffort() {
    return programDifficulty()*programVolume();
    
}

function programTime() {
    var f=60;
    var s=18;
    return programEffort()/(f*s);
    
}


    

    function generateMetrics() {
    var code = document.getElementById('code').value;
    console.log(code);
    const data = { codeText: code };
    let options = {
    method: 'POST',
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(data)


}

// fetch token data from server
    fetch('/analyse',options).then(response=>{
        if(!response.ok){
            console.error(response);
        }
        else
        {
            return response.json();
        }
    }).then(data=>{
        var tokenList=data.tokens;
        console.log(tokenList);
     
        tokenList.forEach(token => {
          
            if(token.tokenClass=="INT"){
                operators.push(token.lexeme)
            }
            else if(token.tokenClass=="IDENTIFIER")
            {
                operators.push(token.lexeme);
            }
            else if(token.tokenClass=="{")
            {
                operators.push("{ }");
            }
            else if(token.tokenClass=="(")
            {
                operators.push("( )");
            }
            else if(token.tokenClass=="[")
            {
                operators.push("[ ]");
            }
            else if(token.tokenClass=="RETURN")
            {
                operators.push(token.lexeme);
            }
            else if(token.tokenClass=="CHAR")
            {
                operators.push(token.lexeme);
            }
            else if(token.tokenClass==",")
            {
                operators.push(",");
            }
            else if(token.tokenClass==";")
            {
                operators.push(";");
            }
            else if(token.tokenClass=="-")
            {
                operators.push("-");
            }
            else if(token.tokenClass=="=")
            {
                operators.push("=");
            }
            else if(token.tokenClass=="+")
            {
                operators.push("+");
            }
            else if(token.tokenClass==">")
            {
                operators.push(">");
            }
            else if(token.tokenClass=="IF")
            {
                operators.push(token.lexeme);
            }
            else if(token.tokenClass=="GE_OP")
            {
                operators.push(token.lexeme);
            }
            else if(token.class=="INC_OP")
            {
                operators.push(token.lexeme)
            }
            else if(token.tokenClass=="WHILE")
            {
                operators.push(token.lexeme);
            }
            else if(token.tokenClass=="CONSTANT")
            {
                operands.push(token.lexeme);
            }
            else if(token.tokenClass=="STRING_LITERAL"){
                operands.push(token.lexeme);
            }
     
        });

        var uniqueOperators=new Set(operators);
        var uniqueOperands=new Set(operands);

        HalsteadMetrics['N1']=operators.length;
        HalsteadMetrics['n1']=uniqueOperators.size;
        HalsteadMetrics['N2']=operands.length;
        HalsteadMetrics['n2']=uniqueOperands.size;

        uniqueOperands.forEach(
            operand=>{
                
                var occurences=operands.filter((e)=>(e===operand)).length;
                HalsteadMetrics.operands[operand]=occurences;

            }

        );

        uniqueOperators.forEach(
            operator=>{
                var occurences=operators.filter((e)=>(e===operator)).length;
                HalsteadMetrics.operators[operator]=occurences;
            }  );
        
        var table = document.getElementById("tokens");
        var tbody = table.getElementsByTagName("tbody")[0];


        Object.entries(HalsteadMetrics.operators).forEach((operator)=>{
                const [key, value] = operator;
                var tr = document.createElement("tr");
                var operatorCell=document.createElement("td");
                operatorCell.innerHTML=key;
                tr.appendChild(operatorCell);
                var operatorOccurences=document.createElement("td");
                operatorOccurences.innerHTML=value;
                tr.appendChild(operatorOccurences);
                tbody.appendChild(tr);
        });
        var index=0;
        Object.entries(HalsteadMetrics.operands).forEach((operand)=>{
                const [key, value] = operand;
                var tableRows=tbody.getElementsByTagName("tr");
                var tr = tableRows[index];
                var operandCell=document.createElement("td");
                operandCell.innerHTML=key;
                tr.appendChild(operandCell);
                var operandOccurences=document.createElement("td");
                operandOccurences.innerHTML=value;
                tr.appendChild(operandOccurences);
                index++;
        });

        var tr = document.createElement("tr");
        var n1Count=document.createElement("td");
        n1Count.innerHTML="n1="+HalsteadMetrics.n1;
        tr.appendChild(n1Count);
        var N1Count=document.createElement("td");
        N1Count.innerHTML="N1="+HalsteadMetrics.N1;
        tr.appendChild(N1Count);
        var n2Count=document.createElement("td");
        n2Count.innerHTML="n2="+HalsteadMetrics.n2;
        tr.appendChild(n2Count);
        var N2Count=document.createElement("td");
        N2Count.innerHTML="N2="+HalsteadMetrics.N2;
        tr.appendChild(N2Count);
        tbody.appendChild(tr);

        var codeMetricsSection=document.getElementsByClassName("code-metrics-section")[0];
        var programLengthElement=document.createElement("p");
        programLengthElement.innerHTML="Program Length="+programLength();
        codeMetricsSection.appendChild(programLengthElement);
        var programVocabularyElement=document.createElement("p");
        programVocabularyElement.innerHTML="Program Vocabulary="+programVocabulary();
        codeMetricsSection.appendChild(programVocabularyElement);
        var programVolumeElement=document.createElement("p");
        programVolumeElement.innerHTML="Program Volume="+programVolume()+" bits";
        codeMetricsSection.appendChild(programVolumeElement);
        var programDifficultyElement=document.createElement("p");
        programDifficultyElement.innerHTML="Program Difficulty="+programDifficulty();
        codeMetricsSection.appendChild(programDifficultyElement);
        var programLevelElement=document.createElement("p");
        programLevelElement.innerHTML="Program Level="+programLevel();
        codeMetricsSection.appendChild(programLevelElement);
        programEffortElement=document.createElement("p");
        programEffortElement.innerHTML="Program Effort="+programEffort()+" elementary mental discriminations";
        codeMetricsSection.appendChild(programEffortElement);
        programTimeElement=document.createElement("p");
        programTimeElement.innerHTML="Program Time="+programTime()+" seconds";
        codeMetricsSection.appendChild(programTimeElement);
    

    }).catch(err=>{
        console.error(err);
        });

}






  