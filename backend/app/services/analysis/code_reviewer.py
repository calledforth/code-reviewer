import google.generativeai as genai
import os


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

    def review(self, file_info, checkstyle_results, guidelines):
        """Get AI review for a file"""
        try:
            prompt = self._create_review_prompt(
                file_info, checkstyle_results, guidelines
            )

            chat_session = self.model.start_chat(history=[])

            response = chat_session.send_message("INSERT_INPUT_HERE")

            print(response.text)

            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a code reviewer."},
                    {"role": "user", "content": prompt},
                ],
            )

            return response.choices[0].message.content

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
        
        Provide a concise code review focusing on:
        1. Code quality issues found by checkstyle
        2. Adherence to provided guidelines
        3. General code improvement suggestions
        """
