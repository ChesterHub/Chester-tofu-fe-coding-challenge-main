import React, { useEffect, useRef, useState } from "react";
import Spinner from "@/components/core/spinner";
import { clearTofuElementStyles, applyTofuElementStyles, createComponentFromElement } from "utils/factoryHelpers";


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
  const docRef = useRef(null);
  const selectedComponentsRef = useRef(null)
  const [htmlContent, setHtmlContent] = useState(null);
  const [fetchingHtml, setFetchingHtml] = useState(false);

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
      docRef.current = iframe.contentDocument || iframe.contentWindow.document
      
      if (docRef.current) {
        const style = docRef.current.createElement("style")
        style.innerHTML = TOFU_ELEMENT_HOVER_CSS
        docRef.current.head.appendChild(style)

        docRef.current.addEventListener("click", onIframeClick)

        highlightSelectedComponents()
      }
    }
  }

  useEffect(() => {
    initDisplayContent()

    return () => {
      if (docRef.current) docRef.current.removeEventListener("click", onIframeClick)
    }
  }, [])

  useEffect(() => {
    selectedComponentsRef.current = selectedComponents
    highlightSelectedComponents()
  }, [selectedComponents])
  
  
  const highlightSelectedComponents = () => {
    if (!docRef.current) return
    clearTofuElementStyles(docRef.current)
    
    selectedComponentsRef.current.forEach((component) =>
      applyTofuElementStyles(docRef.current, component)
    )
  };

  const onIframeClick = (event) => {
    const target = event.target
    if (!target.classList.contains("tofu-element")) return
  
    const tofuId = target.getAttribute("data-tofu-id")
    if (!tofuId) return

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
