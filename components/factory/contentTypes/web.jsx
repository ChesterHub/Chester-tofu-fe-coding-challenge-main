import React, { useEffect, useRef, useState } from "react";
import Spinner from "@/components/core/spinner";
import { createComponentFromElement } from "utils/factoryHelpers";


const WEBSITE_IFRAME_HTML_ID = "website-iframe";
const TOFU_ELEMENT_HOVER_CSS = `
  .tofu-element:hover {
    outline: 2px dashed orange;
    outline-offset: 0px;
    transition: outline 0.2s ease-in-out;
  }
`;

const Web = ({ selectedComponents, addComponent, removeComponent }) => {
  const iframeRef = useRef(null);
  const iframeDoc = useRef(null); // allows us to removeEventListener from iframe in useEffect
  const selectedComponentsRef = useRef(null)
  const [htmlContent, setHtmlContent] = useState(null);
  const [fetchingHtml, setFetchingHtml] = useState(false);

  useEffect(() => {
    initDisplayContent()

    return () => {
      if (iframeDoc.current) iframeDoc.current.removeEventListener("click", handleElementClick)
    }
  }, [])

  useEffect(() => {
    selectedComponentsRef.current = selectedComponents // for handleClick data
    highlightSelectedComponents()
  }, [selectedComponents])
  
  const fetchAndSetHtml = async (url) => {
    try {
      const response = await fetch(url);
      const html = await response.text();
      setHtmlContent(html);
    } catch (error) {
      console.error("Error fetching HTML:", error);
    } finally {
      setFetchingHtml(false);
    }
  };
  
  const initDisplayContent = async () => {
    setFetchingHtml(true);
    await fetchAndSetHtml("/landing-page.html");
    
    const iframe = iframeRef.current
    
    iframe.onload = () => {
      iframeDoc.current = iframe.contentDocument || iframe.contentWindow.document
      
      if (iframeDoc.current) {
        const style = iframeDoc.current.createElement("style")
        style.innerHTML = TOFU_ELEMENT_HOVER_CSS
        iframeDoc.current.head.appendChild(style)

        // Add click event listener for tofu elements
        iframeDoc.current.addEventListener("click", handleElementClick)

        highlightSelectedComponents()
      }
    }
  }
  
  const highlightSelectedComponents = () => {
    if (!iframeDoc.current) return;
  
    const doc = iframeDoc.current;
  
    // Reset all tofu-element styles
    const allTofuElements = doc.querySelectorAll(".tofu-element")
    allTofuElements.forEach((el) => {
      el.style.border = ""
      el.style.outline = ""
      el.style.outlineOffset = ""
    })
  
    // Apply styles to selected components
    selectedComponentsRef.current.forEach((component) => {
      const el = doc.querySelector(`[data-tofu-id="${component.id}"]`)
      if (!el) return
  
      if (component.variation_text) {
        el.textContent = component.variation_text
      }
  
      el.style.outline = "2px solid orange"
      el.style.outlineOffset = "0px"
    });
  };

  const handleElementClick = (event) => {
    const target = event.target
    if (!target.classList.contains("tofu-element")) return
  
    const tofuId = target.getAttribute("data-tofu-id")
    if (!tofuId) return

    //check if component already in list
    const isSelected = selectedComponentsRef.current.some(c => c.id === tofuId)
  
    if (isSelected) {
      removeComponent(tofuId)
    } else {
      const newComponent = createComponentFromElement(target, tofuId)
      addComponent(newComponent)
    }
  }

  return (
    <>
      <div className="relative w-full h-full">
        {fetchingHtml && (
          <div className="absolute left-0 w-full h-full bg-white">
            <Spinner className="flex justify-center items-center h-40" />
          </div>
        )}
        <iframe
          id={WEBSITE_IFRAME_HTML_ID}
          srcDoc={htmlContent}
          className="w-full h-full"
          ref={iframeRef}
          referrerPolicy="no-referrer"
          sandbox="allow-same-origin allow-scripts"
        ></iframe>
      </div>
    </>
  );
};

export default Web;
