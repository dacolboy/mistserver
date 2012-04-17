/// \file FLV2DTSC/main.cpp
/// Contains the code that will transform any valid FLV input into valid DTSC.

#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <cstdlib>
#include <cstdio>
#include <string.h>
#include <unistd.h>
#include <signal.h>
#include "../../util/flv_tag.h" //FLV support
#include "../../util/dtsc.h" //DTSC support
#include "../../util/amf.h" //AMF support

/// Holds all code that converts filetypes to DTSC.
namespace Converters{

  /// Reads FLV from STDIN, outputs DTSC to STDOUT.
  int FLV2DTSC() {
    FLV::Tag FLV_in; // Temporary storage for incoming FLV data.
    DTSC::DTMI meta_out; // Storage for outgoing DTMI header data.
    DTSC::DTMI pack_out; // Storage for outgoing DTMI data.
    std::stringstream prebuffer; // Temporary buffer before sending real data
    bool sending = false;
    unsigned int counter = 0;
    
    while (!feof(stdin)){
      if (FLV_in.FileLoader(stdin)){
        pack_out = FLV_in.toDTSC(meta_out);
        if (pack_out.isEmpty()){continue;}
        if (!sending){
          counter++;
          if (counter > 10){
            sending = true;
            meta_out.Pack(true);
            meta_out.packed.replace(0, 4, DTSC::Magic_Header);
            std::cout << meta_out.packed;
            std::cout << prebuffer.rdbuf();
            prebuffer.str("");
            std::cerr << "Buffer done, starting real-time output..." << std::endl;
          }
          prebuffer << pack_out.Pack(true);
        }else{
          std::cout << pack_out.Pack(true);
        }
      }
    }

    // if the FLV input is very short, do output it correctly...
    if (!sending){
      std::cerr << "EOF - outputting buffer..." << std::endl;
      meta_out.Pack(true);
      meta_out.packed.replace(0, 4, DTSC::Magic_Header);
      std::cout << meta_out.packed;
      std::cout << prebuffer.rdbuf();
    }
    std::cerr << "Done!" << std::endl;
    
    return 0;
  }//FLV2DTSC

};//Buffer namespace

/// Entry point for FLV2DTSC, simply calls Converters::FLV2DTSC().
int main(){
  return Converters::FLV2DTSC();
}//main
