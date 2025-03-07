import google.generativeai as genai
import os
import json
from app.services.analysis.prompts import Prompts


class CodeReviewer:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

        # Create the model
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }

        self.model = genai.GenerativeModel(
            model_name="gemini-2.0-flash-exp",
            generation_config=generation_config,
        )

    def _clean_model_output(self, text):
        """Remove markdown code blocks from model output"""
        if text.startswith("```json"):
            text = text.replace("```json", "", 1)
        elif text.startswith("```"):
            text = text.replace("```", "", 1)
        if text.endswith("```"):
            text = text[:-3]
        return text.strip()

    def review(self, file_info, checkstyle_results, guidelines):
        """Get AI review for a file"""
        try:
            # prompt = self._create_review_prompt(
            #     file_info, checkstyle_results, guidelines
            # )

            # chat_session = self.model.start_chat(history=[])
            # print(prompt)

            # response = chat_session.send_message(prompt)
            # cleaned_response = self._clean_model_output(response.text)

            # # Parse the JSON string inside the 'analysis' key
            # analysis_data = json.loads(cleaned_response)

            # # Print the JSON in a readable format
            # print(json.dumps(analysis_data, indent=4))

            # Meta Prompting
            feedback = None
            if guidelines:
                print("\nInitiating Code Review\n")
                content = f"""
                {Prompts.code_review}
                Code File: {file_info['name']}
                Code Content: {file_info['content']}
                Guidelines : {guidelines}
                """
                code_review = self.model.generate_content(contents=content)

                print("\nInitiating Feedback\n")
                content = f"""
                {Prompts.feedback}
                code_review: {code_review}
                filename: {file_info['name']}
                code content: {file_info['content']}
                Guidelines : {guidelines}
                """
                feedback = self.model.generate_content(contents=content)

            print("\nInitiating Checkstyle Summarization\n")
            content = f""" 
            {Prompts.checkstyle_summarization}
            checkstyle_results: {checkstyle_results}"""

            checkstyle_summarization = self.model.generate_content(contents=content)

            print("\nInitiating Meta Prompting\n")
            content = f"""
            {Prompts.Meta_prompt}
            Feedback based on guidelines provided :
            {feedback if feedback else 'No feedback provided'}
            checkstyle_summarization: {checkstyle_summarization}
            filename: {file_info['name']}"""

            analysis_data = self.model.generate_content(contents=content)
            print("\nReview Completed\n")

            return analysis_data
        except Exception as e:
            return f"AI review failed: {str(e)}"

    def _create_review_prompt(self, file_info, checkstyle_results, guidelines):
        """Create the review prompt"""
        return f"""
        Review this code file: {file_info['name']}
        
        Code content:
        {file_info['content']}
        
        Checkstyle findings:
        {checkstyle_results}
        
        Guidelines:
        {guidelines.decode('utf-8') if guidelines else 'No specific guidelines provided'}
        
        - Distinguish between error from checkstyle and guideline adherence feedback by including a title
        your goal is to highlight the errors or warning provided by checkstyle and provide adherence to additional guidelines provide.
        for each error or warning, return your output in the following format:
        A dictionary with following keys:
            code : code line with error or warning',
            feedback : correction or feedback for the error or warning, inlcuding line number
        
        all these can be enclosed in a list.
        very strictly adhere to the format provided and don't return anyother additional text.

        Important points to remember: 
        - Make sure to provide entire code snippet related to the error or warning and not a single line in code part of dictionary
        - feedback must be appropriately formated, highlight wrong code and provide feedback with correct code 
        - enclose all code in code formatting block
        - make sure to provide feedback for each error or warning 
        - if there are no errors or warnings, provide a message stating that there are no errors or warnings
        """
