var reactant_list = new Array();

function init(){
    window_hash_string = window.location.hash
    if(window_hash_string.length > 0){
        reactant_list = JSON.parse(window_hash_string.slice(1))
    }
    else{
        new_reactant = new Object();
        reactant_list.push(new_reactant)
    }


    render_reactants(reactant_list, "reactants")
}

function render_reactants(reactant_list, div_name){
    //Calculate the mw of each reactant
    for(j in reactant_list){
        reactant_formula = reactant_list[j].formula
        try {
            mass_of_formula = calculate_formula_mass(reactant_formula)
            reactant_list[j].molar_mass = mass_of_formula
        }
        catch(err) {
        }
    }

    $("#" + div_name).empty()

    //Boiler plate for table and headers
    reactant_table = document.createElement("table")
    reactant_table.className = "table table-striped"

    reactant_thead = document.createElement("thead")
    reactant_header = document.createElement("tr")
    reactant_thead.appendChild(reactant_header)
    reactant_table.appendChild(reactant_thead)


    reactant_header.appendChild(document.createElement("th"))
    reactant_header.appendChild(document.createElement("th"))
    //Additional Labels
    cas_header = document.createElement("th")
    cas_header.innerHTML = "CAS"

    formula_header = document.createElement("th")
    formula_header.innerHTML = "Formula"

    equivalent_header = document.createElement("th")
    equivalent_header.innerHTML = "Equivalent"

    mass_header = document.createElement("th")
    mass_header.innerHTML = "Mass (g)"

    molarmass_header = document.createElement("th")
    molarmass_header.innerHTML = "Molar Mass (g/mol)"

    calculatedmass_header = document.createElement("th")
    calculatedmass_header.innerHTML = "Calculated Mass (g)"


    reactant_header.appendChild(cas_header)
    reactant_header.appendChild(formula_header)
    reactant_header.appendChild(equivalent_header)
    reactant_header.appendChild(mass_header)
    reactant_header.appendChild(molarmass_header)
    reactant_header.appendChild(calculatedmass_header)

    reactant_tbody = document.createElement("tbody")
    reactant_table.appendChild(reactant_tbody)

    $("#" + div_name).append(reactant_table)

    for(i in reactant_list){
        reactant_row = document.createElement('tr');

        formula_input = document.createElement("input");
        formula_input.setAttribute("type", "text");
        formula_input.id = i.toString() + "_formula"
        formula_input.onchange = refresh

        if(reactant_list[i].formula != null){
            formula_input.value = reactant_list[i].formula
        }

        equivalents_input = document.createElement("input");
        equivalents_input.setAttribute("type", "text");
        equivalents_input.id = i.toString() + "_equivalent"
        formula_input.onchange = refresh

        if(reactant_list[i].equivalent != null){
            equivalents_input.value = reactant_list[i].equivalent
        }

        mass_input = document.createElement("input");
        mass_input.setAttribute("type", "text");
        mass_input.id = i.toString() + "_mass"

        if(reactant_list[i].mass != null){
            mass_input.value = reactant_list[i].mass
        }

        molar_mass = document.createElement("span");
        molar_mass.id = i.toString() + "_molar_mass"
        molar_mass.innerHTML = reactant_list[i].molar_mass

        //Delete Button
        delete_button = document.createElement("BUTTON");
        delete_button.className = "btn btn-danger"
        delete_button.innerHTML = "Remove"
        delete_button.onclick = function(index, reactant_list){
            return function(){
                save_reactants(reactant_list);
                reactant_list.splice(index, 1);
                render_reactants(reactant_list, "reactants")
            }
        }(i, reactant_list)

        //Enter Cas
        cas_input = document.createElement("input");
        cas_input.setAttribute("type", "text");
        cas_input.id = i.toString() + "_cas"

        if(reactant_list[i].cas != null){
            cas_input.value = reactant_list[i].cas
        }

        cas_button = document.createElement("BUTTON");
        cas_button.innerHTML = "Update CAS"
        cas_button.className = "btn btn-default"
        cas_button.onclick = function(index, reactant_list){
            return function(){
                cas_number = $("#" + index.toString() + "_cas").val()

                $.ajax({
                    url: "/castoformula",
                        method: "GET",
                        data: { cas : cas_number },
                        success: function(index, reactant_list){
                            return function(json){
                                return_obj = JSON.parse(json)
                                if(return_obj.status == "success"){
                                    save_reactants(reactant_list);
                                    reactant_list[index].formula = return_obj.formula
                                    render_reactants(reactant_list, "reactants")
                                }
                            }
                        }(index, reactant_list)
                    });


            }
        }(i, reactant_list)

        cas_structure_button = document.createElement("BUTTON");
        cas_structure_button.innerHTML = "CAS Structure"
        cas_structure_button.className = "btn btn-default"
        cas_structure_button.onclick = function(index, reactant_list){
            return function(){
                cas_number = $("#" + index.toString() + "_cas").val()

                $.ajax({
                    url: "/castostructure",
                        method: "GET",
                        data: { cas : cas_number },
                        success: function(index, reactant_list, cas_number){
                            return function(json){
                                return_obj = JSON.parse(json)
                                if(return_obj.status == "success"){
                                    $("#myModalLabel").empty()
                                    $("#myModalLabel").append(cas_number + " Structure")


                                    $("#modal-body").empty()
                                    $("#modal-body").append(return_obj.smiles)

                                    cas_image = document.createElement("img");
                                    cas_image.src = "http://ccms-support.ucsd.edu:5000/smilesstructure?width=500&height=350&smiles=" + return_obj.smiles
                                    $("#modal-body").append(cas_image)

                                    $("#myModal").modal()
                                }
                            }
                        }(index, reactant_list, cas_number)
                    });
            }
        }(i, reactant_list)

        //Calculated mass
        calculated_mass = document.createElement("span");
        calculated_mass.id = i.toString() + "_calculated_mass"
        calculated_mass.innerHTML = reactant_list[i].calculated_mass


        reactant_row.appendChild(create_td_object(delete_button))
        reactant_row.appendChild(create_td_object(cas_button))
        reactant_row.appendChild(create_td_object(cas_structure_button))
        reactant_row.appendChild(create_td_object(cas_input))
        reactant_row.appendChild(create_td_object(formula_input))
        reactant_row.appendChild(create_td_object(equivalents_input))
        reactant_row.appendChild(create_td_object(mass_input))
        reactant_row.appendChild(create_td_object(molar_mass))
        reactant_row.appendChild(create_td_object(calculated_mass))

        reactant_tbody.appendChild(reactant_row)
    }

    //Saving the json of the data
    reactant_json_string = JSON.stringify(reactant_list)
    window.location.hash = reactant_json_string
}

function create_td_object(input_object){
    td_object = document.createElement("td")
    td_object.appendChild(input_object)
    return td_object
}

/*
    Saving values in input boxes
*/
function save_reactants(reactant_list){
    for(i in reactant_list){
        reactant_object = new Object();
        reactant_object.formula = $("#" + i.toString() + "_formula").val()
        reactant_object.equivalent = $("#" + i.toString() + "_equivalent").val()
        reactant_object.mass = $("#" + i.toString() + "_mass").val()
        reactant_object.cas = $("#" + i.toString() + "_cas").val()

        reactant_list[i] = reactant_object

        console.log($("#" + i.to_string + "_formula").val())
    }

}

function refresh(){
    save_reactants(reactant_list)
    calculate()
    render_reactants(reactant_list, "reactants")
}

function add_reactant(){
    save_reactants(reactant_list);
    new_reactant = new Object();
    reactant_list.push(new_reactant)
    render_reactants(reactant_list, "reactants")
}


function calculate(){
    //Doing the calculation
    save_reactants(reactant_list);



    //Find Limiting reactant entered
    index_of_limiting_reactant = -1
    normalized_limiting_equivalent_mol_number = -1.0
    for(j in reactant_list){
        reactant_mass = $("#" + j.toString() + "_mass").val()
        if(reactant_mass.length > 0){
            index_of_limiting_reactant = j
            reactant_formula = ($("#" + j.toString() + "_formula").val())
            reactant_equivalent = ($("#" + j.toString() + "_equivalent").val())

            mass_of_formula = calculate_formula_mass(reactant_formula)
            normalized_limiting_equivalent_mol_number = parseFloat(reactant_mass) / mass_of_formula / parseFloat(reactant_equivalent)
            break
        }
    }

    if(index_of_limiting_reactant == -1){
        render_reactants(reactant_list, "reactants")
        return;
    }

    //Operate only on reagent list
    for(j in reactant_list){
        reactant_formula = $("#" + j.toString() + "_formula").val()
        mass_of_formula = calculate_formula_mass(reactant_formula)
        reactant_equivalent = parseFloat($("#" + j.toString() + "_equivalent").val())

        reactant_mass = normalized_limiting_equivalent_mol_number * mass_of_formula * reactant_equivalent
        reactant_list[j].calculated_mass = reactant_mass
    }

    render_reactants(reactant_list, "reactants")
}

//Clear masses
function clear_masses(){
    for(i in reactant_list){
        $("#" + i.toString() + "_mass").val("")
    }

    save_reactants(reactant_list);
    render_reactants(reactant_list, "reactants")
}
